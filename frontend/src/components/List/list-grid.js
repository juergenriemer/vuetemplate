import Filter from "@/mixins/Filter";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "ListGrid",
  //  mixins: [Filter],
  data() {
    return {
      filterName: "listing",
      filter: {
        query: {}
      },
      items: [],
      idEdit: null
    };
  },
  created() {
    this.fetch();
  },
  computed: {
    ...mapGetters(["lists", "user"]),
    listId() {
      return this.$route.params.id;
    },
    lastSeen() {
      let userId = localStorage.getItem("userid");
      let lastSeen = this.lists.reduce((map, list) => {
        let user = list.users.find(user => user.userId == userId);
        map[list._id] = user.lastSeen;
        return map;
      }, {});
      return lastSeen;
    },
    missedUpdates() {
      let userId = localStorage.getItem("userid");
      let missed = this.lists.reduce((map, list) => {
        let lastSeen = list.users.find(user => user.userId == userId).lastSeen;
        let count = list.items.filter(item => item.updatedAt > lastSeen).length;
        map[list._id] = count < 100 ? count : 99;
        return map;
      }, {});
      return missed;
    }
  },
  watch: {
    listId() {
      this.sawList(this.listId);
    }
  },
  methods: {
    ...mapActions([
      //    "checkForUpdates",
      "sawList",
      "fetchLists",
      "filterLists",
      "deleteList",
      "updateList"
    ]),
    async fetch() {
      console.log("fetch");
      let result = await this.fetchLists();
      if (this.listId) this.sawList(this.listId);
    },
    async remove(id) {
      let result = await this.deleteList(id);
      //      document.getElementById(id).style.display = "none";
    },
    async edit(data) {
      let result = await this.updateList(data);
      result && (this.idEdit = null);
    }
  }
};
