<template>
  <div id="wrapper">
    <div id="backdrop"><div class="logo">LL</div></div>
    <div id="app">
      <div id="info" v-if="showOffline">!OFFLINE MODE!</div>
      <w-app>
        <router-view />
      </w-app>
    </div>
  </div>
</template>

<script>
import { bus } from "@/main";
export default {
  name: "App",
  data() {
    return {
      showOffline: false,
    };
  },
  created() {
    bus.$on("showOffline", (offline) => (this.showOffline = offline));
  },
  methods: {
    clear() {
      document.querySelector("#console").innerHTML = "";
    },
  },
};
</script>
<style src="./css/form.css"></style>
<style src="./css/layout.css"></style>
<style src="./css/list.css"></style>
<style src="./css/menu.css"></style>
<style src="./css/dialog.css"></style>
<style src="./css/misc.css"></style>
<style src="./css/comment.css"></style>

<style>
#wrapper {
  border: 1px solid transparent;
}
#info {
  font-weight: bold;
  text-align: center;
  font-size: 1.3em;
  color: #fff;
  padding: 4px;
}
#backdrop {
  position: fixed;
  width: 100%;
  height: 130px;
  background: #ff5f49;
  z-index: -1;
}
#backdrop .logo {
  padding: 1em;
  font-size: 2em;
}
</style>
