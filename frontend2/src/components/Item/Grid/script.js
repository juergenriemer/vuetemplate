//import Filter from "@/mixins/Filter";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ItemGrid",
  //mixins: [Filter],
  data() {
    return {
      //      filterName: "list",
      filter: {
        query: {}
      },
      idEdit: null
    };
  },
  created() {
    this.fetch();
    this.seeList();
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
    onFilterChange() {
      this.fetch();
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
    async edit(item) {
      await this.updateItem({
        listId: this.listId,
        itemId: item._id,
        item
      });
      this.idEdit = null;
      //res && (this.idEdit = null);
    }
  }
};
