<template>
  <div>
    <div id="item-list-menu" class="list-row">
      <div class="avatar large">
        <svg
          width="100%"
          height="100%"
          :data-jdenticon-value="list.title"
        ></svg>
      </div>
      <div class="title">{{ list._id }}</div>
      <div class="buttons">
        <i class="fas fa-ellipsis-v" @click="showMenu = !showMenu"></i>
      </div>

      <div
        id="menu"
        v-if="showMenu"
        style="transform-origin: right top; transform: scale(1); opacity: 1"
      >
        <div>
          <ul @click="menu($event)">
            <li data-link="manage">Manage list</li>
            <li data-link="editItems" :class="editListItems ? 'bold' : ''">
              Edit list items
            </li>
            <li data-link="reset">Uncheck all items</li>
            <li data-link="share">Share list</li>
            <li data-link="delete">Delete list</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { bus } from "../../main";
export default {
  name: "ItemListMenu",
  data: () => ({
    showMenu: false,
    editListItems: false,
  }),
  computed: {
    ...mapGetters(["lists"]),
    listId() {
      return this.$route.params.id;
    },
    list() {
      const list = this.lists.find((list) => list._id == this.listId);
      return list || {};
    },
  },
  created() {},
  methods: {
    ...mapActions(["deleteList", "resetList"]),
    menu(evt) {
      const link = evt.target.getAttribute("data-link");
      switch (link) {
        case "editItems":
          this.editListItems = !this.editListItems;
          bus.$emit("editListItems", this.editListItems);
          break;
        case "reset":
          this.resetList(this.listId);
          break;
        case "share":
          bus.$emit("shareList");
          break;
        case "delete":
          bus.$emit("deleteList");
          break;
      }
      this.showMenu = false;
    },
  },
};
// phttps://jdenticon.com/ MIT license
</script>
<style>
#item-list-menu .buttons i {
  padding: 0.5em;
}
#item-list-menu #menu {
  position: absolute;
  top: 50px;
  right: 20px;
  scale: 0;
  opacity: 1;
}
#item-list-menu {
  height: 70px;
  top: 0;
  z-index: 3;
  background: #e0e0e0;
  border-bottom: 1px solid #c0c0c0;
}
#item-list-menu .large.avatar {
  background: #fff;
  width: 60px;
  height: 60px;
}
#item-list-menu .buttons {
  font-size: 1.3em;
  line-height: 70px;
  color: #444;
  padding-right: 1em;
}

#item-list-menu .title {
  font-size: 1.3em;
  line-height: 70px;
  color: #444;
  position: relative;
  margin-right: auto;
  flex-basis: 20px;
  flex-grow: 1;
}
</style>
