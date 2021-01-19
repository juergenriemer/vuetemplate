<template>
  <div>
    [{{user.username}}]
  </div>
</template>
<script>

import { mapGetters, mapActions } from "vuex";
export default {
  computed: mapGetters(["user"]),
  created(){
    if( !this.user.username){
      this.fetch();
    }
  },
  methods: {
    ...mapActions(["info"]),
    async fetch() {
      let res = await this.info()
      console.log( this.user)
    }
  }
};
</script>
