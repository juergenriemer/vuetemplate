<template>
  <div>
          <div
            class="bubble right"
            v-for="comment in item.comments"
            :key="comment._id"
          >
            <div>
              <button @click="remove(comment._id)">X</button>
              {{ comment.text }}
            </div>
          </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { bus } from "../../main";
export default {
  name: "ItemComment",
  props: ["listId", "itemId"],
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters(["lists", "user"]),
    list() {
      const list = this.lists.find(list => list._id == this.listId);
      return list || {};
    },
    item() {
      let item = this.list.items.find( itm => itm._id == this.itemId );
      return item;
    },
  },
  methods: {
    ...mapActions(["removeComment"]),
    async remove(commentId) {
      this.removeComment({
        listId : this.listId,
        itemId : this.itemId,
        commentId
      })
        .catch((err) => {
          this.showError(err);
        });
    },
  },
};
</script>

<style>
</style>
