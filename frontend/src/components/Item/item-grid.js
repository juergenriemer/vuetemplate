import ItemComment from "@/components/Item/ItemComment";
import { mapGetters, mapActions } from "vuex";
import { bus } from "../../main";
import Menu from "@/mixins/Menu";

export default {
  name: "ItemGrid",
  mixins: [Menu],
  components: {
    ItemComment
  },
  data() {
    return {
      itemCount: 0,
      editListItems: false,
      filter: {
        query: {}
      },
      idEdit: null,
      newTitle: null
    };
  },
  created() {
    //this.fetch();
    this.seeList();
    bus.$on("editListItems", data => {
      this.editListItems = data;
    });
    bus.$on("hideComment", () => this.closeComments());
    bus.$on("keydown", evt => {
      if (evt.key == "Escape") {
        this.closeInput();
        bus.$emit("hideComment");
      }
    });
  },
  computed: {
    ...mapGetters(["lists", "userId"]),
    listId() {
      return this.$route.params.id;
    },
    list() {
      const list = this.lists.find(list => list._id == this.listId);
      return list || {};
    },
    items() {
      let items = this.list.items;
      //      if (items) items.sort((a, b) => (a.done > b.done ? 1 : -1));
      return this.list.items || [];
    },
    lastSeen() {
      const lastSeen = this.lists.reduce((map, list) => {
        let user = list.users.find(user => user.userId == this.userId);
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
  updated() {
    // scroll to bottom in case we added a new item
    if (this.itemCount < this.items.length) {
      this.itemCount = this.items.length;
      this.$el.scrollTop = this.$el.scrollHeight;
    }
  },
  methods: {
    ...mapActions(["fetchLists", "filterItems", "removeItem", "updateItem"]),
    closeComments() {
      this.$el
        .querySelectorAll(".comment-background")
        .forEach(node => node.classList.remove("comment-background"));
      this.$el
        .querySelectorAll(".comments")
        .forEach(node => node.classList.add("hide"));
    },
    toggleComment(itemId) {
      const comment = this.$refs[itemId][0];
      const isHidden = comment.classList.contains("hide");
      this.closeComments();
      if (isHidden) {
        comment.classList.remove("hide");
        bus.$emit("showComment", itemId);
        comment.previousElementSibling.classList.add("comment-background");
      } else {
        bus.$emit("hideComment", itemId);
      }
    },
    seeList() {
      console.log("????????????????????????????????????");
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
          // use bus for this
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
        this.hideAllPanels();
        const input = row.querySelector("input");
        input && input.focus();
      }, 0); /* need to wait for element to render */
    },
    async fetch() {
      //let result = await this.fetchLists();
    },
    async remove(itemId) {
      this.removeItem({
        listId: this.listId,
        itemId
      }).catch(err => {
        this.showError(err);
      });
    },
    async done(item) {
      item.done = !item.done;
      this.saveInput(item);
    },
    async saveInput(item) {
      if (this.newTitle) item.title = this.newTitle;
      this.updateItem({
        listId: this.listId,
        itemId: item._id,
        item
      })
        .then(() => {
          this.closeInput();
        })
        .catch(err => {
          this.showError(err);
        });
    }
  }
};
