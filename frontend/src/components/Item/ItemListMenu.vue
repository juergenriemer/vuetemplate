<template lang="pug">
#item-list-menu
  .buttons
    i.fas.fa-arrow-left(@click="backToList()")
  .avatar(@click="showInfo", v-if="listId")
    svg(width="100%", height="100%", :data-jdenticon-value="list.title")
  .title(@click="showInfo", v-if="listId") {{ list.title }}
  .menu(v-if="listId")
    i.fas.fa-ellipsis-v
    ul(@click="menu($event)")
      li(data-link="info") List info
      li(data-link="manage-list", v-if="listAdmin") Manage list
      li(data-link="manage-members", v-if="listAdmin") Manage members
      li(data-link="reset") Uncheck all items
      li(data-link="share", v-if="listAdmin") Share list
      li(data-link="delete", v-if="listAdmin") Delete list
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import Menu from "@/mixins/Menu";
import { bus } from "../../main";
export default {
  name: "ItemListMenu",
  mixins: [Menu],
  data: () => ({
    infoShown: false,
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
    showMenu(evt) {
      const menu = evt.target.querySelector("#menu");
      const isClosed = menu.classList.contains("hide");
      document
        .querySelectorAll("#menu")
        .forEach((node) => node.classList.add("hide"));
      if (isClosed) menu.classList.remove("hide");
    },
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
        case "reset":
          this.resetList({ listId: this.listId });
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
        case "manage-list":
          bus.$emit("showInfo", "manage-list");
          break;
        case "manage-members":
          bus.$emit("showInfo", "manage-members");
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
