<template>
  <ion-item
      @click="click($event)"
      nav="list"
      lines="full"
      class="highlight"
      style="cursor:pointer"
      detail="false">
    <avatar size="medium" :list-title="list.title" :updates=newItemComments></avatar>
    <ion-label class="title">
      {{ list.title }} 
    </ion-label>
    <div>
      <ion-buttons slot="end">
        <div symbol nav="info" v-if="list.users.length > 1">
          <ion-button>
            <ion-icon :icon="people"></ion-icon>
          </ion-button>
          <ion-icon star :icon="star" :class="role"></ion-icon>
        </div>
        <ion-button @click="showMenu($event, { list })">
          <ion-icon :icon="ellipsisVertical"></ion-icon>
        </ion-button>
      </ion-buttons>
    </div>
  </ion-item>
</template>

<script>
import { IonButton, IonButtons, IonIcon, IonItem, IonLabel } from "@ionic/vue";
import { ellipsisVertical, people, star } from "ionicons/icons";
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
      star,
      people,
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
    role() {
      return this.list.users.find( usr => usr.userId == this.$store.getters.userId ).role;
    },
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
    click( evt ){
      const nav = evt.target.closest( "[nav]");
      if( nav ){
          let path = `/app/items/${this.list._id}`;
          if( nav.getAttribute( "nav") == "info" ) {
            const type = ( this.role == 'admin' || this.role == "owner") ? "members" : "info";
            path = `/app/${type}/${this.list._id}`;
          }
          this.nav( path )
      }
    },
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
                  listId: this.list._id,
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
[symbol] {
  position: relative;
  display:flex;
  align-items: center;
  justify-content: center;
  flex-direction:column;
}
[symbol] [star] {
  display:none;
  position:absolute;
  top:-3px;
  text-shadow: 4px 4px 10px -6px #000000;
}
[symbol] [star].owner{
  display:block;
  color: goldenrod;
}
[symbol] [star].admin {
  display:block;
  color: green;
}
</style>
