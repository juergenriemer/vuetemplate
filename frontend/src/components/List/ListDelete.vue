<template lang="pug">
w-dialog.dialog(
  shadow,
  v-model="showDialog",
  transition="bounce",
  title="Confirm deletion",
  width="400"
)
  w-form(novalidate, v-if="active", @validate="validate")
    .body
      .title Are you sure you want to delete this list?
      .text There is no way to recover a list once deleted.
      .buttons
        w-button.ma1(@click="showDialog = false", text, shadow, md) CANCEL
        w-button.ma1(type="submit", shadow, md, bg-color="error") DELETE
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { bus } from "../../main";
import Form from "@/mixins/Form";
export default {
  mixins: [Form],
  name: "ListDelete",
  data: () => ({
    email: "",
    showDialog: false,
  }),
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
  created() {
    bus.$on("deleteList", (data) => {
      this.showDialog = true;
    });
  },
  methods: {
    ...mapActions(["removeList"]),
    showNextList(deleteId) {
      let count = this.lists.length;
      let nextId = "";
      if (count > 1) {
        let index = this.lists.findIndex((list) => list._id == deleteId);
        let nextIndex = index > 0 ? index - 1 : 1;
        nextId = this.lists[nextIndex]._id;
      }
      this.showDialog = false;
      this.$root.$router.push({
        path: `/main/${nextId}`,
      });
    },
    async submit() {
      let deleteId = this.listId;
      this.showNextList(deleteId);
      this.removeList(deleteId).catch((err) => this.showError(err));
    },
  },
};
</script>
