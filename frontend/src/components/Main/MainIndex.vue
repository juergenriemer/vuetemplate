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
      <manage-list></manage-list>
      <approve-invites hide="true"></approve-invites>
      <item-grid></item-grid>
      <item-add></item-add>
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

