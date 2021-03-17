<template>
  <div>
    <div class="info" v-if="showOffline">!OFFLINE MODE!</div>
    <div id="box">
      <div class="left column" v-if="showLeft">
        <user-info class="header"></user-info>
        <list-add class="add"></list-add>
        <div>{{ windowWidth }}</div>
        <list-grid class="content"></list-grid>
      </div>
      <div class="right column" :class="[showInfo ? '' : 'hide']">
        <info-header class="header" :title="infoTitle"></info-header>
        <component class="content" :is="infoComponent"></component>
      </div>
      <div class="middle column" v-if="showMiddle">
        <item-list-menu class="header"></item-list-menu>
        <item-grid class="content"></item-grid>
        <item-add class="add" v-show="!showComment"></item-add>
        <comment-add class="add" v-show="showComment"></comment-add>
      </div>
    </div>
    <div>
      <list-delete></list-delete>
      <list-share></list-share>
    </div>
    <user-socket></user-socket>
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
import ManageMembers from "@/components/List/ManageMembers";
import ApproveInvites from "@/components/User/ApproveInvites";
import UserInfo from "@/components/User/UserInfo";
import UserSocket from "@/components/User/UserSocket";
import InfoHeader from "@/components/Info/InfoHeader";
import ListInfo from "@/components/Info/ListInfo";
import CommentAdd from "@/components/Item/CommentAdd";
import { bus } from "@/main";

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
    ManageMembers,
    ApproveInvites,
    InfoHeader,
    ListInfo,
    CommentAdd,
  },
  data() {
    return {
      phoneWidth: 400,
      windowWidth: window.innerWidth,
      infoTitle: "",
      infoComponent: "",
      showOffline: false,
      showComment: false,
      showInfo: false,
      infos: {
        "approve-invites": "Approve Invitations",
        "list-info": "List information",
        "manage-list": "Mange list",
        "manage-members": "Mange members",
      },
    };
  },
  computed: {
    showLeft() {
      if (this.windowWidth > this.phoneWidth) return true;
      if (!this.$route.params.id && !this.showInfo) return true;
      return false;
    },
    showMiddle() {
      if (this.windowWidth > this.phoneWidth) return true;
      if (this.$route.params.id && !this.showInfo) return true;
      return false;
    },
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.windowWidth = window.innerWidth;
    });
  },
  created() {
    bus.$on("showInfo", (component) => {
      this.infoTitle = this.infos[component];
      this.infoComponent = component;
      this.showInfo = true;
    });
    bus.$on("closeInfo", () => (this.showInfo = false));
    bus.$on("showComment", () => (this.showComment = true));
    bus.$on("hideComment", () => (this.showComment = false));
    bus.$on("showOffline", (offline) => (this.showOffline = offline));
  },
};
</script>
<style>
</style>

