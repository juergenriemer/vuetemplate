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
<style src="./css/form.css"></style>
<style>
body {
  margin: 0;
  font-family: Segoe UI, Helvetica Neue, Helvetica, Lucida Grande, Arial, Ubuntu,
    Cantarell, Fira Sans, sans-serif;
  font-size: 14.2px;
  background: whitesmoke;
  overflow: hidden;
}
.bold {
  font-weight: bold;
}
#app {
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

#user,
#main {
  box-shadow: 0 2px 2px 0 #c0c0c0, 2px 5px 5px 0 #c0c0c0;
}
@media (min-width: 1400px) {
  #main {
    margin-top: 20px !important;
    height: calc(100vh - 40px);
  }
}
#main {
  min-width: 640px;
  max-width: 1400px;
  margin: 0 auto;
}
#user {
  min-width: 260px;
  max-width: 500px;
  height: 100vh;
  margin: 0 auto;
  position: relative;
}
@media (min-width: 501px) {
  #user {
    margin-top: 20px;
    height: calc(100vh - 40px);
  }
}

.row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
}

.column {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex: 1;
}
#main .left.column {
  min-width: 260px;
  max-width: 420px;
  background: #fff;
}
#main .right.column {
  min-width: 380px;
  max-width: 980px;
  background: repeating-linear-gradient(
    45deg,
    #ebebeb,
    #ebebeb 5px,
    #def4ec 5px,
    #def4ec 10px
  );
}

#user .left.column {
  padding: 0.5em;
  min-width: 260px;
  max-width: 500px;
  background: #fff;
}
#user .right.column {
  padding: 0.5em;
  min-width: 260px;
  max-width: 500px;
  background: #fff;
}

/* menu */

#menu {
  background: #fff;
  z-index: 100;
  width: 250px;
  border: 1px solid #c0c0c0;
  border-radius: 3px;
  box-shadow: 0 2px 5px 0 #c0c0c0, 0 2px 10px 0 #c0c0c0;
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
  position: absolute;
  left: 50%;
  top: 50%;
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
.modal .primary.green {
  color: #fff;
  background: #3ba559;
}
.modal .secondary {
  color: #ff5f49;
  background: #fff;
}
.modal .secondary.green {
  color: #3ba559;
  background: #fff;
}

.avatar {
  background-color: #e6e6e6;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  width: 49px;
  height: 49px;
}
.avatar img {
  width: 49px;
  height: 49px;
}
.text {
  position: relative;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently */
}
</style>
