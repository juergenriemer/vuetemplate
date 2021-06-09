<template>
  <ion-item @click="nav(`/app/items/${list._id}`)"
      lines="full"
      detail="false"
    button="true">
    <avatar size="medium" :list-title="list.title" :updates=newItemComments></avatar>
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
      updates : 0,
      newItemComments : 0
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
  mounted() {
      this.checkUpdates();
      this.$nextTick(() => {
        this.highlight();
      } )
  },
  watch : {
    listUpdated() {
      this.checkUpdates();
      this.highlight();
    },
    '$route': function( to, from ) {
      if( /^.app.list/.test( to.path)){
        this.checkUpdates();
      }
    }
  },
  computed: {
    listUpdated() {
      return this.list.updatedAt;
    },
    lastSeen() {
      const userId = this.$store.getters.userId;
      return this.list.users.find( usr => usr.userId == userId ).lastSeen;
    },
    lastModified() {
       return this.list.updatedAt;
    },
  },
  methods: {
    highlight() {
            // REF: same in commentlistitem.vuej
      this.$nextTick(() => {
        const node = this.$el//.querySelector( ".highlight");
        let flagged = node.classList.contains( "new");
        if( ! flagged ) {
          let _new = false;
          const userId = this.$store.getters.userId;
            // REF: same in itemlistitem.vuej
          let user = this.list.lastSeen.find( elem => elem.userId == userId );
          if( ! user ) _new = true;
          else if( this.list.lastAction > user.seen ) _new = true;
          if( _new ) {
            node.classList.add( "new")
            setTimeout( ()=>{
              this.$store
                .dispatch("sawList", {
                  listId: this.listId,
                  userId,
                  seen: this.list.lastAction
                })
                .catch((err) => this.showError(err));
              if( node ) node.classList.remove( "new")
            }, 4000 );
          }
        }
      });
    },
    checkUpdates() {
      const userId = this.$store.getters.userId;
      let count = 0;
      this.list.items.forEach( itm => {
        let user = itm.lastSeen.find( elem => elem.userId == userId );
        if( ! user ) count++;
        else if( itm.lastAction > user.seen ) count++;
        itm.comments.forEach( cmt => {
          // REF: same in comentsitempage.vuej
          let user = cmt.lastSeen.find( elem => elem.userId == userId );
          if( ! user ) count++;
          else if( cmt.lastAction > user.seen ) count++;
        })
      })
      this.newItemComments = count;
    },
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
