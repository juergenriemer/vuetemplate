<template>
  <div id="wrapper">
    <div id="backdrop"><div class="logo">!!</div></div>
    <div id="app">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
body {
  margin: 0;
  font-family: Segoe UI, Helvetica Neue, Helvetica, Lucida Grande, Arial, Ubuntu,
    Cantarell, Fira Sans, sans-serif;
  font-size: 14.2px;
}

#app {
  width: 1300px;
  margin: 0 auto;
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
