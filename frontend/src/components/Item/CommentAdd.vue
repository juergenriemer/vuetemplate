<template lang="pug">
form#comment-add.comment-background(@submit.prevent="add")
  input(
    type="text",
    name="text",
    @blur="delayedAdd",
    placeholder="ADD NEW COMMENT",
    v-model="comment.text"
  )
  i.fas.fa-times.clear(@click="clear()")
</template>

<script>
import { mapActions } from "vuex";
import { bus } from "../../main";
export default {
  name: "CommentAdd",
  data() {
    return {
      itemId: null,
      comment: { text: "" },
    };
  },
  created() {
    bus.$on("showComment", (itemId) => (this.itemId = itemId));
    bus.$on("hideComment", () => (this.itemId = null));
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
      bus.$emit("hideComment");
    },
    delayedAdd() {
      setTimeout(() => {
        this.add();
      }, 250);
    },
    async add() {
      if (!this.comment.text) return;
      let comment = Object.assign(
        { _id: this.objectId(), creatorId: this.myUserId },
        this.comment
      );
      this.addComment({
        listId: this.listId,
        itemId: this.itemId,
        comment,
      })
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
