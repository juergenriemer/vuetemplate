<template>
  <form @submit.prevent>
    <h3>Logout</h3>
    <button type="submit" @click=submit>sumbit</button>
  </form>
</template>
<script>

import { mapActions } from "vuex";
export default {
  created(){
    console.log( 'do it')
      this.logout()
  },
  methods: {
    ...mapActions(["logout"]),
    async submit() {
      this.logout()
    }
  }
};
</script>
