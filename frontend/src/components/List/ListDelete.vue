<template>
  <div id="modal" class="xdeleteForm" v-if="showConfirmation">
    <div class="modal deleteForm">
      <p class="title">Are you sure you want to delete this list?</p>
      <div class="buttons">
        <button class="secondary" @click="showConfirmation = false">
          cancel
        </button>
        <button class="primary" @click="remove(list._id)">
          delete the list
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { bus } from "../../main";
export default {
  name: "ListDelete",
  data: () => ({
    email: "",
    showConfirmation: false,
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
      this.showConfirmation = true;
    });
  },
  methods: {
    ...mapActions(["deleteList"]),
    async remove(listId) {
      this.deleteList(listId)
        .then(() => {
          let count = this.lists.length;
          let nextId = "";
          if (count > 1) {
            let index = this.lists.findIndex((list) => list._id == listId);
            let nextIndex = index > 0 ? index - 1 : 1;
            nextId = this.lists[nextIndex]._id;
          }
          this.showConfirmation = false;
          this.$root.$router.push({
            path: `/main/${nextId}`,
          });
        })
        .catch((err) => {
          this.showError(err);
        });
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
