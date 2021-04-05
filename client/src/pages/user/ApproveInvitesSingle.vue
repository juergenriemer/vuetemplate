<template lang="pug">
#single
  .single.column
    .form
      h3 Approve invitations
      approve-invites
</template>
<script>
import ApproveInvites from "@/components/User/ApproveInvites";
export default {
  name: "ApproveInvitesSingle",
  components: {
    ApproveInvites,
  },
};
</script>
<style>
</style>
