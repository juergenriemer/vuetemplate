<template>
  <div id="item-list-menu">
    <div class="buttons">
      <i class="fas fa-arrow-left" @click="backToList()"></i>
    </div>
    <div class="avatar" @click="showInfo" v-if="listId">
      <svg width="100%" height="100%" :data-jdenticon-value="list.title"></svg>
    </div>
    <div class="title" @click="showInfo" v-if="listId">{{ list.title }}</div>
    <div class="buttons menu" v-if="listId">
      <i class="fas fa-ellipsis-v" @click="showMenu = !showMenu"></i>
      <div
        id="menu"
        v-if="showMenu"
        xxxxstyle="transform-origin: right top; transform: scale(1); opacity: 1"
      >
        <ul @click="menu($event)">
          <li data-link="info">List info</li>
          <li v-if="listAdmin" data-link="manage">Manage list</li>
          <li data-link="editItems" :class="editListItems ? 'bold' : ''">
            Edit list items
          </li>
          <li data-link="reset">Uncheck all items</li>
          <li v-if="listAdmin" data-link="share">Share list</li>
          <li v-if="listAdmin" data-link="delete">Delete list</li>
        </ul>
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
    infoShown: false,
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
  created() {
    bus.$on("showInfo", (component) => {
      this.infoShown = component == "list-info";
    });
    bus.$on("closeInfo", (component) => {
      this.infoShown = false;
    });
  },
  methods: {
    ...mapActions(["deleteList", "resetList"]),
    backToList() {
      self.location.href = "/#/";
    },
    showInfo() {
      if (this.infoShown) bus.$emit("closeInfo");
      else bus.$emit("showInfo", "list-info");
    },
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
        case "info":
          bus.$emit("showInfo", "list-info");
          break;
        case "manage":
          bus.$emit("showInfo", "manage-list");
          break;
      }
      this.showMenu = false;
    },
  },
};
// phttps://jdenticon.com/ MIT license
</script>
<style>
.header {
  cursor: pointer;
}
.header {
  display: flex;
}
.header i {
  font-size: 1.3em;
  padding: 15px;
}
</style>
