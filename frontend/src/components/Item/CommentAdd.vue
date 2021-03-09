<template>
  <form id="comment-add" @submit.prevent="add">
    <input
      type="text"
      name="text"
      @blur="delayedAdd"
      placeholder="NEW COMMENT"
      v-model="comment.text"
    />
    <i class="fas fa-times clear" @click="clear()" />
  </form>
</template>

<script>
import { mapActions } from "vuex";
import { bus } from "../../main";
export default {
  name: "CommentAdd",
  data() {
    return {
      itemId : null,
      comment: { text: "" },
    };
  },
  created() {
    bus.$on("showComment", (itemId) => this.itemId = itemId );
    bus.$on("hideComment", () => this.itemId = null );
  },
  computed: {
    listId() {
      return this.$route.params.id;
    },
  },
  methods: {
    ...mapActions(["addComment"]),
    clear() {
      this.comment.text = "";
    },
    delayedAdd() {
      setTimeout(() => {
        this.add();
      }, 250);
    },
    async add() {
      if (!this.comment.text) return;
      const params = {
        listId: this.listId,
        itemId: this.itemId,
        comment: this.comment,
      };
      this.addComment(params)
        .then(() => {
          this.comment.text = "";
          //this.$el.querySelector("input").focus();
        })
        .catch((err) => {
          this.showError(err);
        });
    },
  },
};
</script>

<style>
#item-add {
  height: 60px;
  background: #e0e0e0;
  border-top: 1px solid #c0c0c0;
}

#item-add input {
  font-size: 1.3em;
  background: #fff;
  width: calc(100% - 40px);
  margin: 10px;
  padding: 10px;
  border: 0;
}

#item-add input:focus {
  outline: none;
}

#item-add button {
  display: none;
}
</style>
