<template lang="pug">
base-layout(page-title="My Memberships", link="/app/list")
  template(v-slot:title)
    avatar(size="large", logo="Listle")
  template(v-slot:actions-end)
    .header-icon
      ion-icon(:icon="people", size="large")
  template(v-slot:content)
    .ion-padding(v-if="lists && lists.length")
      p
        | You are member of below lists.
      p
        | Select the ones you want to leave.
      form(@submit.prevent="submit", novalidate)
        ion-list
          ion-item(
            v-for="list in lists",
            :key="list._id",
            @click="approves[list._id] = !approves[list._id]",
            button="true"
          )
            avatar(size="medium", :list-title="list.title")
            ion-label.title {{ list.title }}
            ion-checkbox(
              slot="end",
              v-model="approves[list._id]",
              @click="approves[list._id] = !approves[list._id]"
            )
          ion-button(type="submit", expand="block", :disabled="disabled") LEAVE button.hide(type="submit", :disabled="disabled")
    .ion-padding(v-else)
      p
        | You have no memberships at the moment.
</template>
<script>
import {
  IonCheckbox,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonAvatar,
} from "@ionic/vue";
import Avatar from "@/components/base/Avatar.vue";
import Form from "@/mixins/Form";
import User from "@/mixins/User";
import { people } from "ionicons/icons";

export default {
  mixins: [Form, User],
  components: {
    Avatar,
    IonCheckbox,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonAvatar,
  },
  computed: {
    lists() {
      return this.$store.getters.lists.filter(
        (lst) => lst.users[0].userId != this.myId()
      );
    },
  },
  data: () => ({
    approves: {},
    people,
  }),
  created() {
    this.getListInvites();
  },
  methods: {
    async getListInvites() {
      this.$store
        .dispatch("myInvites")
        .then((res) => {
          this.status = "OK";
          if (res.data && res.data.lists) {
            this.lists = res.data.lists;
            this.approves = this.lists.reduce((map, list) => {
              map[list._id] = true;
              return map;
            }, {});
          }
        })
        .catch((err) => {
          switch (err.status) {
            case 422:
              this.status = err.message;
              break;
            default:
              this.status = "idle";
              this.showError(err);
              break;
          }
        });
    },
    async submit() {
      let loadId = Object.keys(this.approves).find((key) => this.approves[key]);
      let pathAdd = loadId ? `/${loadId}` : ``;
      this.$store
        .dispatch("approveInvites", {
          approves: this.approves,
          lists: this.lists.filter((inv) => this.approves[inv._id]),
        })
        .then((res) => {
          this.nav(`/app/list${pathAdd}`);
        })
        .catch((err) => {
          alert(err);
        });
    },
  },
};
</script>
