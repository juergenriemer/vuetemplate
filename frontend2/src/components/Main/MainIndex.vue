<template>
  <div class="row" id="main">
    <div class="left column">
      <user-socket></user-socket>
      <user-info></user-info>
      <list-add></list-add>
      <list-grid></list-grid>
    </div>
    <div class="right column">
      <item-list-menu></item-list-menu>
      <item-grid></item-grid>
      <item-add></item-add>
    </div>
  </div>
</template>
  <script>
import ListAdd from "@/components/List/ListAdd";
import ListGrid from "@/components/List/ListGrid";
import ItemAdd from "@/components/Item/ItemAdd";
import ItemGrid from "@/components/Item/ItemGrid";
import ItemListMenu from "@/components/Item/ItemListMenu";
import UserInfo from "@/components/User/UserInfo";
import UserSocket from "@/components/User/UserSocket";

export default {
  name: "DashboardIndex",
  components: {
    UserInfo,
    UserSocket,
    ListAdd,
    ListGrid,
    ItemGrid,
    ItemAdd,
    ItemListMenu,
  },
};
</script>
<style>
body {
  background: whitesmoke;
  overflow: hidden;
}

#main {
  border: 1px solid #c0c0c0;
  box-shadow: 4px 4px 4px #444;
}
@media (min-width: 1400px) {
  #main {
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
.left.column {
  min-width: 260px;
  max-width: 420px;
  background: #fff;
}
.right.column {
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

