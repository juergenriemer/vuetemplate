<template lang="pug">
base-layout(page-title="Synchronize Lists",page-id="Synchronize")
  template(v-slot:title)
    avatar(size="large", logo="Listle")
  template(v-slot:actions-end)
    .header-icon
      ion-icon(:icon="sync", size="large")
  template(v-slot:content)
    .icon
      ion-icon(:icon="sync", size="large")
    .info
      .action {{action}}
      .errors(v-if="errors.length")
        ul
          li(v-for="error in errors", :key=error) {{error}}
      .error-info(v-if="errorInfo")
        p Error happened
</template>

<script>
import {
  IonButton,
  IonIcon,
} from "@ionic/vue";
import Avatar from "@/components/base/Avatar.vue";
import { sync } from "ionicons/icons";
export default {
  components: {
    Avatar,IonIcon,IonButton
  },
  data: () => ({
    sync,
    action:"initializing...",
    errorInfo: false,
    errors:[]
  }),
  mounted() {
    this.synchronize();
  },
  methods: {
    getActions() {
      const lists = [...this.$store.getters.lists];
      const offlineChanges = this.getOfflineChanges(lists);
      let sOD = localStorage.getItem("sOD");
      const offlineDeletions = sOD ? JSON.parse(sOD) : [];
      const lastAction = {
        order:10,
        method : "fetchLists"
        , params: {}
        , title : "update lists from server"
      }
      const actions = [...offlineChanges, ...offlineDeletions, lastAction].sort((a, b) =>
        a.order > b.order ? 1 : -1
      );
      return actions;
    },
    synchronize() {
      let icon = this.$el.querySelector( ".icon ion-icon" );
      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      const actions = this.getActions();
      const updateIds = ( key, oldId, newId ) => {
        actions
          .filter( act => act.params[key] == oldId )
          .forEach( act => act.params[key] = newId );
      }
      (async () => {
        let errors = [];
        let count = 0;
        let deg = 0;
        for (const action of actions) {
          try {
               deg = (deg>360) ? 0 : (deg+=30);
               if( icon ) icon.style.transform = `rotate(${deg}deg)`;
            this.action = action.title;
            const res = await this.$store.dispatch(
              action.method,
              action.params
            );
            // update temp ids with actual server ones
            switch( action.method ) {
              case "addList" : 
                updateIds( "listId", action.tempId, res.data.list._id );
              break;
              case "addItem" : 
                updateIds( "itemId", action.tempId, res.data.item._id );
              break;
              case "addComment" : 
                updateIds( "commentId", action.tempId, res.data.comment._id );
              break;
            }
            await sleep( 2000 );
          } catch (e) {
            let msg = ( e.message ) ? e.message : "error occurred";
            this.errors.unshift( `${msg} (${++count})` );
          }
        }
        localStorage.removeItem("sOD");
        localStorage.removeItem("offline-since");
        if (this.errors.length) this.errorInfo = true;
        else this.nav( "/app/list" );
        return;
      })();
      return;
    },
    getOfflineChanges(lists) {
      let result = [];
      let Processed = new Map();
      const inspect = function (item) {
        Object.keys(item).forEach((key) => {
          if (key !== "parent" && typeof item[key] === "object") {
            inspect(item[key]);
          }
          if (item.offline === true && !Processed[item._id]) {
            let type, order;
            let params = {};
            let action = /^id/.test(item._id) ? "add" : "update";
            let tempId = ( action == "add" ) ? item._id : null;
            let p = item.parent.parent;
            if (!p) {
              // list
              type = "list";
              order = 1;
              params[type] = (({ title, description }) => ({
                title,
                description,
              }))(item);
            } else {
              let parentId = p._id;
              p = p.parent.parent;
              if (!p) {
                type = "item";
                order = 2;
                params[type] = (({ title, done }) => ({ title, done }))(item);
                params.listId = parentId;
              } else {
                type = "comment";
                order = 3;
                params[type] = (({ text, imageFile }) => ({
                  text,
                  imageFile,
                }))(item);
                params.listId = p._id;
                params.itemId = parentId;
              }
            }
            if (action == "update") params[`${type}Id`] = item._id;
            const method =
              action + type.charAt(0).toUpperCase() + type.slice(1);
            const title = `${action} ${type} ${item._id}`;
              action + type.charAt(0).toUpperCase() + type.slice(1);
            Processed[item._id] = true;
            result.push({
              order,
              title,
              method,
              params,
              tempId,
            });
          }
        });
      };
      var addParent = {
        set: function (target, prop, value) {
          if (typeof value === "object") {
            var p = new Proxy({ parent: target }, addParent);
            for (var key in value) {
              p[key] = value[key];
            }
            return (target[prop] = p);
          } else {
            target[prop] = value;
            return true;
          }
        },
      };
      let data = new Proxy({}, addParent);
      Object.assign(data, lists);
      inspect(data);
      return result;
    },
  },
};
</script>
<style scoped>


.info {
  display : flex;
  justify-content:center;
  align-items:center;
  flex-direction:column;
}
.icon {
  display:flex;
  align-items:center;
  justify-content:center;
  height:50%;
  zoom:3;
}
.errors {
    max-height:100px;
        overflow:auto;
            margin:10px;
                padding:10px;
                }
                .errors ul { margin:0;padding:0;}
                .errors li {
                    color:red;
                    text-align:center;
                        list-style : none;
                        }
</style>
