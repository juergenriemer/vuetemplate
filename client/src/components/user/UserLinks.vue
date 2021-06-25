<template>
  <div id="UserLinks">
    <div v-if="page=='login'">
      <a @click='nav("/user/reset-password")'>Forgot password?</a>
      <div class="dot">&middot;</div>
      <a @click='nav("/user/register")'>Register with Listle</a>
    </div>
    <div v-if="page=='register'">
      <a @click='nav("/user/login")'>Already have an account? Log In</a>
    </div>
  </div>
</template>
<style>
#UserLinks{
  margin-top:15px;
  text-align:center;
  border-top:1px dashed #c0c0c0;
}
#UserLinks div {
  display:flex;
  align-items:center;
  justify-content:center;
  padding:10px;
}
#UserLinks a {
  cursor:pointer;
}
#UserLinks .dot {
  color:#444;
  padding:4px;
  font-size:2em;
  line-height:0.5em;
}
</style>
<script>
import { IonItemDivider } from "@ionic/vue";
export default {
  props: ['page'],
  components: {
    IonItemDivider
  },
};
</script>
