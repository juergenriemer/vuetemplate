<template lang="pug">
base-layout(page-title="Approve Invitations", link="/app/list")
  template(v-slot:title)
    avatar(size="large", list-title="Listle")
    ion-avatar#xxx(size="large")
      ion-icon(:icon="mail", size="small")
  template(v-slot:content)
    div(v-if="invites && invites.length")
      p
        | You have been invited to join lists.
      p
        | Select the ones you want and join.
      form(@submit.prevent="submit", novalidate)
        .ion-list
          ion-item(
            v-for="invite in invites",
            :key="invite._id",
            @click="approves[invite._id] = !approves[invite._id]",
            button="true"
          )
            avatar(size="medium", :list-title="invite.title")
            ion-label.title {{ invite.title }}
            ion-checkbox(
              slot="end",
              v-model="approves[invite._id]",
              @click="approves[invite._id] = !approves[invite._id]"
            )
          ion-button(type="submit", expand="block", :disabled="disabled") JOIN
          button.hide(type="submit", :disabled="disabled")
    .ion-padding(v-else)
      p
        | There are no invitations at the moment.
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
import { mail, key, logOut } from "ionicons/icons";

export default {
  mixins: [Form],
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
  data: () => ({
    approves: {},
    invites: [],
    mail,
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
            this.invites = res.data.lists;
            this.approves = this.invites.reduce((map, list) => {
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
          lists: this.invites.filter((inv) => this.approves[inv._id]),
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
