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
    ...mapActions(["deleteList"]),
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
      this.deleteList(deleteId).catch((err) => this.showError(err));
    },
  },
};
</script>
<style scoped>
.modal.deleteForm {
  width: 400px;
  height: 170px;
  margin-left: -200px;
  margin-top: -85px;
  animation-name: growDeleteForm;
  animation-duration: 0.1s;
}
@keyframes growDeleteForm {
  from {
    width: 0px;
    height: 0px;
    margin-left: 0px;
    margin-top: 0px;
  }
  to {
    height: 170px;
    width: 400px;
    margin-left: -200px;
    margin-top: -85px;
  }
}
.modal.deleteForm {
  width: 400px;
  height: 300px;
  margin-left: -200px;
  margin-top: -150px;
  animation-name: growDeleteForm;
  animation-duration: 0.1s;
}
@keyframes growDeleteForm {
  from {
    width: 0px;
    height: 0px;
    margin-left: 0px;
    margin-top: 0px;
  }
  to {
    height: 30px;
    width: 400px;
    margin-left: -200px;
    margin-top: -150px;
  }
}
.modal input {
  padding: 0.5em;
  display: block;
  font-size: 1em;
  width: 75%;
  margin: auto;
}
</style>>
