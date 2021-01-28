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
      idEdit: null,
      lastSeen: null
    };
  },
  created() {
    this.fetch();
  },
  computed: {
    ...mapGetters(["lists", "user"]),
    listId() {
      return this.$route.params.id;
    }
  },
  watch: {
    listId() {
      //      this.sawList(this.listId);
    }
  },
  methods: {
    ...mapActions([
      //    "checkForUpdates",
      //    "seenList",
      "sawList",
      "fetchLists",
      "filterLists",
      "deleteList",
      "updateList"
    ]),
    onFilterChange() {
      this.fetch();
    },
    async fetch() {
      let result = await this.fetchLists();
      setTimeout(() => {
        //this.checkForUpdates();
        //this.seeList();
      }, 1000);
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
