import Filter from "@/mixins/Filter";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "ListGrid",
  //  mixins: [Filter],
  data() {
    return {
      items: [],
      idEdit: null
    };
  },
  created() {
    this.fetch();
  },
  computed: {
    ...mapGetters(["lists", "user", "userId"]),
    listId() {
      return this.$route.params.id;
    },
    lastSeen() {
      let lastSeen = this.lists.reduce((map, list) => {
        let user = list.users.find(user => user.userId == this.userId);
        map[list._id] = user.lastSeen;
        return map;
      }, {});
      return lastSeen;
    },
    missedUpdates() {
      let missed = this.lists.reduce((map, list) => {
        let lastSeen = list.users.find(user => user.userId == this.userId)
          .lastSeen;
        let newItems = list.items.filter(item => item.updatedAt > lastSeen);
        let count = newItems ? newItems.length : 0;
        map[list._id] = count < 100 ? count : 99;
        return map;
      }, {});
      return missed;
    }
  },
  watch: {
    listId() {
      this.sawList({ listId: this.listId, userId: this.userId });
    }
  },
  updated() {
    this.$el.scrollTop = 0; //this.$el.scrollHeight;
  },
  methods: {
    ...mapActions(["sawList", "fetchLists", "deleteList", "updateList"]),
    to(listId) {
      self.location.href = "/#/main/" + listId;
    },
    async fetch() {
      if (!self.isLocal)
        this.fetchLists()
          .then(() => {
            if (this.listId) {
              return this.sawList({ listId: this.listId, userId: this.userId });
            }
          })
          .catch(err => {
            this.showError(err);
          });
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
