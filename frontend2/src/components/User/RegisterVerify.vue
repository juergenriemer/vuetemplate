<template lang="pug">
#user.row
  .left.column
    .form
      h3 Verify your registration
      .w-flex.result(v-if="status == 'token-expired'")
        i.error.bounce.fas.fa-exclamation-triangle
        div
          p
            | The link already expired.
          p
            | Click the link below to send it again.
          a(href="#/resend-verification")
            | Resend registration verification
      .w-flex.result(v-if="status == 'token-invalid'")
        i.error.bounce.fas.fa-exclamation-triangle
        div
          p
            | The link is invalid.
          p
            | In case you pasted the link make sure you copied the entire link.
            | We can also send another verification e-mail to you.
          a(href="#/resend-verification")
            | Resend registration verification
      .w-flex.result(v-if="status == 'unknown-user'")
        i.error.bounce.fas.fa-exclamation-triangle
        div
          p
            | There is no user attached to this link
          p
            | Perhaps you want to register again?
          a(href="#/register")
            | Register an account
      .w-flex.result(v-if="status == 'user-already-verified'")
        i.error.bounce.fas.fa-exclamation-triangle
        div
          p
            | The account is already verified.
          p
            | In case you have troubles loggin in, consider to reset your password.
          a(href="#/reset-password")
            | Reset your password
      .w-flex.result(v-if="status == 'OK'")
        i.success.bounce.fas.fa-check
        div
          p
            | Your registration was successful.
          p
            | You get redirected
</template>
<script>
// REF: test all links in above error modes.. didn't test them all
import { mapGetters, mapActions } from "vuex";
import Form from "@/mixins/Form";
export default {
  name: "RegisterVerify",
  mixins: [Form],
  created() {
    this.submit();
  },
  methods: {
    ...mapActions(["registerVerify"]),
    submit() {
      const token = this.$route.params.token;
      this.registerVerify(token)
        .then((res) => {
          this.status = "OK";
          console.log(res);
          if (res.data.lists) {
            this.invites = res.data.lists;
            this.$router.push("/approve-invites");
          } else {
            this.$router.push("/main");
          }
        })
        .catch((err) => {
          console.log(err);
          switch (err.status) {
            case 400:
              this.status = "idle";
              console.warn(err.message);
              break;
            case 422:
              this.status = err.message;
              break;
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
<style>
.list-row {
  display: flex;
  position: relative;
  border-bottom: 1px solid #f2f2f2;
  line-height: 49px;
  cursor: pointer;
  color: #000;
}
.list-row:active {
  background: #ebebeb;
}
.list-row:hover {
  background: #f5f5f5;
}
.list-row a {
  text-decoration: none;
}
.list-row a:active,
.list-row a:visited {
  color: #000;
}
.list-row .bulb {
  position: relative;
}
.list-row .avatar {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin: 3px;
}

.list-row .badge {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  margin-top: 1px;
  margin-right: 1px;
  font-weight: bold;
  font-size: 11px;
  line-height: 16px;
  color: white;
  width: 16px;
  height: 16px;
  text-align: center;
  border-radius: 50%;
  background: red;
  border: 2px solid white;
}
.list-title {
  position: relative;
  margin-right: auto;
  flex-basis: 20px;
  flex-grow: 1;
}
.list-title a {
  overflow: hidden;
  position: absolute;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  font-size: 17px;
}
/* samecss as in app.vue */
#RegisterVerify .buttons {
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
  padding: 24px;
}
#RegisterVerify .buttons button {
  text-transform: uppercase;
  transition: box-shadow 0.2s ease-out, background 0.2s ease-out,
    color 0.2s ease-out;
  padding: 12px 24px;
  border-radius: 3px;
  border: 0;
}
#RegisterVerify .buttons button:hover {
  box-shadow: 3px 3px 3px #c0c0c0;
}
#RegisterVerify .buttons button:focus {
  outline: none;
}
.modal .title {
  font-size: 20px;
  font-weight: 400;
}

#RegisterVerify .primary {
  color: #fff;
  background: #ff5f49;
}
#RegisterVerify .primary.green {
  color: #fff;
  background: #3ba559;
}
</style>
