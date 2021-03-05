<template>
  <div id="wrapper">
    <div id="backdrop"><div class="logo">!!</div></div>
    <div id="app">
      <w-app>
        <router-view />
      </w-app>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>
<style src="./css/form.css"></style>
<style src="./css/layout.css"></style>
<style src="./css/list.css"></style>
<style src="./css/menu.css"></style>
<style src="./css/dialog.css"></style>
<style src="./css/misc.css"></style>

<style>
#wrapper {
  border: 1px solid transparent;
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
