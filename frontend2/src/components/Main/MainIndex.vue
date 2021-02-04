<template>
  <div class="row" id="main">
    <div class="left column">
      <user-info></user-info>
      <list-index></list-index>
    </div>
    <div class="right column">
      <user-socket></user-socket>
      <item-index></item-index>
    </div>
  </div>
</template>
  <script>
import ListIndex from "@/components/List/ListIndex";
import ItemIndex from "@/components/Item/ItemIndex";
import UserInfo from "@/components/User/UserInfo";
import UserSocket from "@/components/User/UserSocket";

export default {
  name: "DashboardIndex",
  components: {
    "user-info": UserInfo,
    "user-socket": UserSocket,
    "list-index": ListIndex,
    "item-index": ItemIndex,
  },
};
</script>
<style>
body {
  background: whitesmoke;
}

#main {
  border: 1px solid #c0c0c0;
  box-shadow: 4px 4px 4px #444;
}
@media (min-width: 1300px) {
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
</style>

