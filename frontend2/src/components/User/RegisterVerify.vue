<template>
  <div>
    <h3>Verify your registration</h3>
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
  data: () => ({
    status: "verifying...",
  }),
  created() {
    this.verify();
  },
  methods: {
    ...mapActions(["verifyRegistration"]),
    async verify() {
      const token = this.$route.params.token;
      const res = await this.verifyRegistration(token);
      if (res && res.data && res.data.is_verified) {
        this.$router.push("/main");
      } else {
        this.status = res;
      }
    },
  },
};
</script>
