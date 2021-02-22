<template>
  <div>
    <h3>Accept invitation</h3>
    <p v-if="status=='expired'">
    The link expired.<br> 
    Please try to register again.
    </p>
    <p v-if="status=='invalid'">
    The link is not valid.<br> 
    Please check if the link was properly pasted.
    </p>
  </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ShareVerify",
  data: () => ({
    status: "verifying...",
  }),
  created() {
    this.verify();
  },
  methods: {
    ...mapActions(["verifyInvitation"]),
    async verify() {
      const token = this.$route.params.token;
      const res = await this.verifyInvitation(token);
      if (res && res.data && res.data.listId) {
        this.$root.$router.push({
          path: `/main/${res.data.listId}`,
        });
      } else {
        this.status = res;
      }
    },
  },
};
</script>
