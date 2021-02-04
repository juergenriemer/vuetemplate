<template>
  <div id="item-list-menu" class="list-row">
    <div class="avatar large">
      <svg width="100%" height="100%" :data-jdenticon-value="list.title"></svg>
    </div>
    <div class="title">
      {{ list.title }}
    </div>
    <div class="buttons">
      <i class="fas fa-ellipsis-v"></i>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "ItemListMenu",
  data: () => ({}),
  computed: {
    ...mapGetters(["lists"]),
    listId() {
      return this.$route.params.id;
    },
    list() {
      const list = this.lists.find((list) => list._id == this.listId);
      return list || {};
    },
  },
};
// phttps://jdenticon.com/ MIT license
</script>
<style>
#item-list-menu {
  height: 70px;
  top: 0;
  z-index: 3;
  background: #e0e0e0;
  border-bottom: 1px dashed #c0c0c0;
}
#item-list-menu .large.avatar {
  width: 60px;
  height: 60px;
}
#item-list-menu .buttons {
  font-size: 1.3em;
  line-height: 70px;
  color: #444;
  padding-right: 1em;
}

#item-list-menu .title {
  font-size: 1.3em;
  line-height: 70px;
  color: #444;
  position: relative;
  margin-right: auto;
  flex-basis: 20px;
  flex-grow: 1;
}
</style>
