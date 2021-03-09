<template>
  <div id="wrapper">
    <!--div id="console"></div>
    <button id="console-clear" @click="clear">X</button-->
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
  methods: {
    clear() {
      document.querySelector("#console").innerHTML = "";
    },
  },
  created() {
    /*
    window.console.log = (text) => {
      document.querySelector("#console").innerHTML =
        `${text}<br>` + document.querySelector("#console").innerHTML;
    };
    window.console.warn = (text) => {
      document.querySelector("#console").innerHTML =
        `<b color="red">${text}</b><br>` +
        document.querySelector("#console").innerHTML;
    };
     */
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
#console-clear {
  position: fixed;
  top: 0;
  right: 400;
  z-index: 2000;
}
#console {
  position: fixed;
  top: 0;
  right: 0;
  background: white;
  z-index: 1000;
  overflow: auto;
  width: 400px;
  height: 800px;
  border: 2px solid black;
}
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
