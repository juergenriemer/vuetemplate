<template lang="pug">
  div
    div.bubble(
      v-for="comment in item.comments",
      :class="userIsMe(comment.userId)? 'right' : '' ",
      :key="comment._id"
    )
      div.bubble-content
        .top
          div.name(:style="{ color: userColor(comment.userId) }")
            | {{ userById(comment.userId).name  }}
          i.fas.fa-times(v-on:click="remove(comment._id)")
        div.text {{ comment.text }}
        div.date {{ date( comment.updatedAt ) }}
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { bus } from "../../main";

export default {
  name: "ItemComment",
  props: ["listId", "itemId"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["lists", "user"]),
    list() {
      const list = this.lists.find((list) => list._id == this.listId);
      return list || {};
    },
    item() {
      let item = this.list.items.find((itm) => itm._id == this.itemId);
      return item;
    },
  },
  methods: {
    ...mapActions(["removeComment"]),
    async remove(commentId) {
      this.removeComment({
        listId: this.listId,
        itemId: this.itemId,
        commentId,
      }).catch((err) => {
        this.showError(err);
      });
    },
  },
};
</script>

<style>
</style>

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
