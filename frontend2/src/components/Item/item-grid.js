//import Filter from "@/mixins/Filter";
import { mapGetters, mapActions } from "vuex";
import { bus } from "../../main";

export default {
  name: "ItemGrid",
  data() {
    return {
      editListItems: false,
      filter: {
        query: {}
      },
      idEdit: null,
      newTitle: null
    };
  },
  created() {
    this.fetch();
    this.seeList();
    bus.$on("editListItems", data => {
      this.editListItems = data;
    });
  },
  computed: {
    ...mapGetters(["lists", "user"]),
    listId() {
      return this.$route.params.id;
    },
    list() {
      const list = this.lists.find(list => list._id == this.listId);
      return list || {};
    },
    items() {
      let items = this.list.items;
      if (items) items.sort((a, b) => (a.done > b.done ? 1 : -1));
      return this.list.items || [];
    },
    lastSeen() {
      const userId = localStorage.getItem("userid");
      const lastSeen = this.lists.reduce((map, list) => {
        let user = list.users.find(user => user.userId == userId);
        map[list._id] = user.lastSeen;
        return map;
      }, {});
      return lastSeen;
    }
  },
  watch: {
    listId() {
      this.seeList();
    }
  },
  methods: {
    ...mapActions(["fetchLists", "filterItems", "deleteItem", "updateItem"]),
    seeList() {
      let missed = localStorage.getItem("missed");
      if (missed) {
        let missed2 = JSON.parse(missed);
        if (missed2 && missed2[this.listId]) {
          this.lastSeen = missed2[this.listId].lastSeen;
        }
      }
    },
    closeInput() {
      this.newTitle = null;
      this.idEdit = null;
    },
    editInput(evt, item) {
      switch (evt.key) {
        case "Escape":
          this.closeInput();
          break;
        case "Enter":
          //item.title = this.newTitle;
          //this.submit(item);
          break;
      }
    },
    editMode(evt, item) {
      const row = evt.target.closest("form");
      this.idEdit = this.idEdit == item._id ? null : item._id;
      this.newTitle = item.title;
      setTimeout(() => {
        const input = row.querySelector("input");
        input && input.focus();
      }, 0); /* need to wait for element to render */
    },
    async fetch() {
      let result = await this.fetchLists();
    },
    async remove(itemId) {
      await this.deleteItem({
        listId: this.listId,
        itemId
      });
    },
    async done(item) {
      item.done = !item.done;
      await this.updateItem({
        listId: this.listId,
        itemId: item._id,
        item
      });
    },
    async saveInput(item) {
      if (this.newTitle) item.title = this.newTitle;
      await this.updateItem({
        listId: this.listId,
        itemId: item._id,
        item
      });
      this.closeInput();
    }
  }
};
