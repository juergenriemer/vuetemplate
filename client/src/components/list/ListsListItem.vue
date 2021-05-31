<template>
  <ion-item @click="nav(`/app/items/${list._id}`)"
      lines="full"
      detail="false"
    button="true">
    <avatar size="medium" :list-title="list.title" :updates=updates></avatar>
    <ion-label class="title">
      {{ list.title }}
    </ion-label>
    <ion-buttons slot="end">
      <ion-button @click="showMenu($event, { list })">
        <ion-icon
          slot="icon-only"
          :icon="ellipsisVertical"
          size="small"
        ></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-item>
</template>

<script>
import { IonButton, IonButtons, IonIcon, IonItem, IonLabel } from "@ionic/vue";
import { ellipsisVertical } from "ionicons/icons";
import Avatar from "@/components/base/Avatar.vue";
import MenuComponent from "@/components/list/ListMenu.vue";
import Menu from "@/mixins/Menu";
import Alert from "@/mixins/Alert";

export default {
  name : "ListsListItem",
  props: ["list"],
  mixins: [Menu, Alert],
  data() {
    return {
      ellipsisVertical,
    };
  },
  components: {
    Avatar,
    MenuComponent,
    IonButton,
    IonButtons,
    IonIcon,
    IonItem,
    IonLabel,
  },
  computed: {
    lastSeen() {
      const userId = this.$store.getters.userId;
      return this.list.users.find( usr => usr.userId == userId ).lastSeen;
    },
    lastModified() {
       return this.list.updatedAt;
    },
    updates() {
      let count = 0;
      const lastSeen = this.lastSeen;
      if ( this.lastModified > lastSeen ) {
        const check = ( elems ) => {
          for( let elem in elems ){
            if( typeof( elems[elem]) == "object" ) check( elems[elem] )
            else if( elem == "updatedAt" && elems[elem] > lastSeen ) { console.warn( elems);
              count++;
            }
          }
        }
        check( this.list.items )
        console.warn( count )
        return count;
      }
      return 0;
    }
  },
  methods: {
    menuAction(action) {
      switch (action) {
        case "delete":
          this.confirm("to delete this list", () => {
            this.$store
              .dispatch("deleteList", {
                listId: this.list._id,
              })
              .catch((err) => this.showError(err));
          });
          break;
        case "leave":
          this.confirm("to leave this list", () => {
            this.$store
              .dispatch("leaveList", {
                listId: this.list._id,
              })
              .catch((err) => this.showError(err));
          });
          break;
        case "info":
          this.nav(`/app/info/${this.list._id}`);
          break;
        case "members":
          this.nav(`/app/members/${this.list._id}`);
          break;
        case "edit":
          this.nav(`/app/edit/${this.list._id}`);
          break;
      }
    },
  },
};
</script>
<style>
.title {
  font-size: 1.3em;
}
</style>
