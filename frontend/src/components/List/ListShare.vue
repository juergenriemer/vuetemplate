<template>
  <div id="modal" class="shareForm" v-if="showForm">
    <form class="modal shareForm" @submit.prevent>
      <p class="title">Invite a friend to share this list!</p>
      <p>
        <small
          >Your friend will be able to add, edit and delete items as well as
          mark them done.</small
        >
      </p>
      <input type="text" placeholder="ENTER E-MAIL" v-model="email" />
      <div class="buttons">
        <button class="secondary green" @click="showForm = false">
          cancel
        </button>
        <button type="submit" class="primary green" @click="share">
          INVITE
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { bus } from "../../main";
export default {
  name: "ListShare",
  data: () => ({
    email: "",
    role: "user",
    showForm: false,
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
    bus.$on("shareList", (data) => {
      this.showForm = true;
    });
  },
  methods: {
    ...mapActions(["inviteList"]),
    async share() {
      this.inviteList({
        listId: this.listId,
        email: this.email,
        role: this.role,
      })
        .then(() => {
          this.showForm = false;
        })
        .catch((err) => {
          console.log(err);
          switch (err.status) {
            default:
              this.status = "idle";
              this.showError(err);
              break;
          }
        });
    },
  },
};
</script>
<style scoped>
.modal.shareForm {
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
.modal.shareForm {
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
