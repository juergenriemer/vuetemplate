<template>
  <div id="item-list-menu">
    <div class="avatar">
      <svg width="100%" height="100%" :data-jdenticon-value="list.title"></svg>
    </div>
    <div class="title">{{ list._id }}</div>
    <div class="buttons menu">
      <i class="fas fa-ellipsis-v" @click="showMenu = !showMenu"></i>
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
        case "manage":
          bus.$emit("manageList", true);
          break;
      }
      this.showMenu = false;
    },
  },
};
// phttps://jdenticon.com/ MIT license
</script>
<style>
</style>
