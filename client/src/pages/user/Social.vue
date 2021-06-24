<template lang="pug">
base-layout(page-title="Logging in Listle")
  template(v-slot:title)
    avatar(size="large", logo="Listle")
  template(v-slot:content)
    .ion-padding
      info-sheet(type="error", v-if="status == 'token-expired'")
        template(v-slot:content)
          p
            | The link already expired.
          p
            | Click the link below to send it again.
          a(href="/user/resend-verification")
            | Resend registration verification

      info-sheet(type="error", v-if="status == 'token-invalid'")
        template(v-slot:content)
          p
            | The link is invalid.
          p
            | In case you pasted the link make sure you copied the entire link.
            | We can also send another verification e-mail to you.
          a(href="#/resend-verification")
            | Resend registration verification

      info-sheet(type="error", v-if="status == 'unknown-user'")
        template(v-slot:content)
          p
            | There is no user attached to this link
          p
            | Perhaps you want to register again?
          a(href="#/register")
            | Register an account

      info-sheet(type="error", v-if="status == 'user-already-verified'")
        template(v-slot:content)
          p
            | The account is already verified.
          p
            | In case you have troubles logging in, consider to reset your password.
          a(href="#/reset-password")
            | Reset your password

      info-sheet(type="success", v-if="status == 'OK'")
        template(v-slot:content)
          p
            | Your registration was successful.
          p
            | You get redirected
</template>
<script>
// REF: test all links in above error modes.. didn't test them all
import Avatar from "@/components/base/Avatar.vue";
import InfoSheet from "@/components/base/InfoSheet.vue";
export default {
  components: {
    InfoSheet,
    Avatar,
  },
  data() {
    return {
      status: "idle",
      showInfoSheet: false,
    };
  },
  created() {
    this.submit();
  },
  methods: {
    submit() {
      const token = this.$route.params.id;
      this.$store
        .dispatch("social", token)
        .then((res) => {
          this.status = "OK";
          this.showInfoSheet = true;
          if (res.data.lists && res.data.lists.length) {
            this.invites = res.data.lists;
            // this doesn't loooooad users, hence no login!
            this.nav("/user/approve-invites");
          } else {
            this.nav("/app/list");
          }
        })
        .catch((err) => {
          this.showInfoSheet = true;
          switch (err.status) {
            case 400:
              this.status = "idle";
              this.showError(err.message); // server side validation
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
