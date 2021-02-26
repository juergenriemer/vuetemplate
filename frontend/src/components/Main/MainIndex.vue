<template>
  <div id="box">
    <div class="left column">
      <user-socket></user-socket>
      <user-info class="header"></user-info>
      <list-add class="add"></list-add>
      <list-grid class="content"></list-grid>
    </div>
    <div class="xhide right column">
      <manage-list class="content"></manage-list>
      <approve-invites class="content"></approve-invites>
    </div>
    <div class="middle column">
      <item-list-menu class="header"></item-list-menu>
      <item-grid class="content"></item-grid>
      <item-add class="add"></item-add>
    </div>
    <div>
      <list-delete></list-delete>
      <list-share></list-share>
    </div>
  </div>
</template>
  <script>
import ListAdd from "@/components/List/ListAdd";
import ListGrid from "@/components/List/ListGrid";
import ListDelete from "@/components/List/ListDelete";
import ListShare from "@/components/List/ListShare";
import ItemAdd from "@/components/Item/ItemAdd";
import ItemGrid from "@/components/Item/ItemGrid";
import ItemListMenu from "@/components/Item/ItemListMenu";
import ManageList from "@/components/List/ManageList";
import ApproveInvites from "@/components/User/ApproveInvites";
import UserInfo from "@/components/User/UserInfo";
import UserSocket from "@/components/User/UserSocket";

export default {
  name: "DashboardIndex",
  components: {
    UserInfo,
    UserSocket,
    ListAdd,
    ListGrid,
    ListDelete,
    ListShare,
    ItemGrid,
    ItemAdd,
    ItemListMenu,
    ManageList,
    ApproveInvites,
  },
};
</script>
<style>
</style>

