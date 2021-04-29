<template lang="pug">
base-layout(page-title="Verify Account Deletion")
  template(v-slot:title)
    avatar(size="large", list-title="Listle")
  template(v-slot:content)
    .ion-padding
      info-sheet(type="error", v-if="status == 'token-expired'")
        template(v-slot:content)
          p
            | The link already expired.
          p
            | Click the link below to request again.
          a(href="/user/delete")
            | Reset password again

      info-sheet(type="error", v-if="status == 'token-invalid'")
        template(v-slot:content)
          p
            | The link is invalid.
          p
            | In case you pasted the link make sure you copied the entire link.
            | You can also request deletion again.
          a(href="/user/delete")
            | Reset password again

      info-sheet(type="error", v-if="status == 'user-not-found'")
        template(v-slot:content)
          p
            | There is no user attached to this link
          p
            | It seems you already deleted your account

      info-sheet(type="success", v-if="status == 'OK'")
        template(v-slot:content)
          p
            | The deletion of your account was successful.
          p
            | We hope to see you again!
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
        .dispatch("deleteUserVerify", token)
        .then((res) => {
          this.status = "OK";
          this.showInfoSheet = true;
          setTimeout( ()=> {
            //this.nav( "/")
                     }, 3000);
        })
        .catch((err) => {
          this.showInfoSheet = true;
          console.log( err )
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
