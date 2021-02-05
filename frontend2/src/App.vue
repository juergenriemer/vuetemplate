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
.bold {
  font-weight: bold;
}
#app {
  margin: 0 auto;
  min-width: 640px;
  max-width: 1400px;
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
/* menu */

#menu {
  background: #fff;
  z-index: 100;
  width: 250px;
  border: 1px solid #c0c0c0;
  box-shadow: 3px 3px 3px #c0c0c0;
}
#menu ul {
  margin: 0;
  padding: 0;
}
#menu li {
  font-size: 1.3em;
  line-height: 2.2em;
  list-style: none;
  padding-left: 13px;
  padding-top: 3px;
  padding-bottom: 3px;
  cursor: pointer;
}
#menu li:hover {
  background: whitesmoke;
}

/* modal window */
.modal {
  z-index: 200;
  padding: 24px 24px 24px;
  border-radius: 3px;
  box-shadow: 0 15px 50px 0 #444;
  background: #fff;
  font-size: 1.5em;
  width: 400px;
  height: 170px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -200px;
  margin-top: -85px;
  animation-name: grow;
  animation-duration: 0.1s;
}
.modal .buttons {
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
  padding: 24px;
}
.modal .buttons button {
  text-transform: uppercase;
  transition: box-shadow 0.2s ease-out, background 0.2s ease-out,
    color 0.2s ease-out;
  padding: 12px 24px;
  border-radius: 3px;
  border: 0;
}
.modal .buttons button:hover {
  box-shadow: 3px 3px 3px #c0c0c0;
}
.modal .buttons button:focus {
  outline: none;
}
.modal .title {
  font-size: 20px;
  font-weight: 400;
}

.modal .primary {
  color: #fff;
  background: #ff5f49;
}
.modal .secondary {
  color: #ff5f49;
  background: #fff;
}
@keyframes grow {
  from {
    width: 0px;
    height: 0px;
    margin-left: 0px;
    margin-top: 0px;
  }
  to {
    height: 170px;
    width: 400px;
    margin-left: -200px;
    margin-top: -85px;
  }
}
</style>
