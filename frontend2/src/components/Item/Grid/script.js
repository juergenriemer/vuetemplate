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
      idEdit: null,
      lastSeen: null
    };
  },
  created() {
    this.fetch();
    this.seeList();
  },
  computed: {
    ...mapGetters(["lists", "user"]),
    idList() {
      return this.$route.params.id;
    },
    items() {
      let list = this.lists.filter(list => list._id == this.idList);
      return list && list[0] && list[0].items ? list[0].items : [];
    }
  },
  watch: {
    idList() {
      this.seeList();
    }
  },
  methods: {
    ...mapActions(["fetchLists", "filterItems", "deleteItem", "updateItem"]),
    seeList() {
      let missed = localStorage.getItem("missed");
      if (missed) {
        let missed2 = JSON.parse(missed);
        if (missed2 && missed2[this.idList]) {
          this.lastSeen = missed2[this.idList].lastSeen;
        }
      }
    },
    onFilterChange() {
      this.fetch();
    },
    async fetch() {
      let result = await this.fetchLists();
    },
    async remove(id) {
      await this.deleteItem({
        idList: this.idList,
        idItem: id
      });
      //document.getElementById(id).style.display = "none";
    },
    async done(data) {
      data.done = !data.done;
      const res = await this.updateItem({
        idList: this.idList,
        idItem: data._id,
        data: data
      });
    },
    async edit(data) {
      const res = await this.updateItem({
        idList: this.idList,
        idItem: data._id,
        data: data
      });
      res && (this.idEdit = null);
    }
  }
};
