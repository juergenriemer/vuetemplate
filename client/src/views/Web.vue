<template>
  <ion-page>
    <div id="wrapper">
      <div id="backdrop"><div class="logo">LL</div></div>
      <div id="box" class="user" v-if="!app">
        <div class="single column">
          <component :is="page"></component>
        </div>
      </div>
      <div id="box" class="app" v-if="app">
        <div class="left column">
          <lists-page></lists-page>
        </div>
        <div class="right column" v-if="page">
          <component :is="page"></component>
        </div>
        <div class="middle column" v-if="listId">
          <items-page></items-page>
        </div>
      </div>
    </div>
  </ion-page>
</template>

<script>
import ListsPage from "../pages/app/ListsPage.vue";
import ItemsPage from "../pages/app/ItemsPage.vue";
import CommentsPage from "../pages/app/CommentsPage.vue";
import ListInfoPage from "../pages/app/ListInfoPage.vue";
import ListMembersPage from "../pages/app/ListMembersPage.vue";
import AddListPage from "../pages/app/AddListPage.vue";
import EditListPage from "../pages/app/EditListPage.vue";
import Login from "../pages/user/Login.vue";
import Register from "../pages/user/Register.vue";
import RegisterVerify from "../pages/user/RegisterVerify.vue";
import ResetPassword from "../pages/user/ResetPassword.vue";
import ResetPasswordVerify from "../pages/user/ResetPasswordVerify.vue";
import ApproveInvites from "../pages/user/ApproveInvites.vue";

//() => import("@/pages/ListInfoPage.vue"),

const pages = {
  comments: CommentsPage,
  info: ListInfoPage,
  members: ListMembersPage,
  add: AddListPage,
  edit: EditListPage,
  login: Login,
  register: Register,
  "register-verify": RegisterVerify,
  "reset-password": ResetPassword,
  "reset-password-verify": ResetPasswordVerify,
  "approve-invites": ApproveInvites,
};
import {
  IonPage,
} from "@ionic/vue";

export default {
  components: {
    IonPage,
    ListsPage,
    ItemsPage,
    CommentsPage,
    AddListPage,
    EditListPage,
    ListInfoPage,
    ListMembersPage,
    Login,
    Register,
    RegisterVerify,
    ResetPassword,
    ResetPasswordVerify,
    ApproveInvites,
  },
  data() {
    return {
      infoComponent: null,
    };
  },
  created() {
    if (this.app) {
      this.$store.dispatch("info");
      this.$store.dispatch("fetchLists");
    }
  },
  computed: {
    app() {
      return /^\/app/.test(this.$route.path);
    },
    page() {
      if( /^\/app\/comments/.test( this.$route.path )) {
        return pages[ 'comments' ];
      }
      return pages[this.$route.params.page];
    },
    listId() {
      return this.$route.params.id;
    },
  },
  methods: {},
  updated() {},
};
</script>
<style>
#wrapper {
  border: 1px solid transparent;
}
#info {
  font-weight: bold;
  text-align: center;
  font-size: 1.3em;
  color: #fff;
  padding: 4px;
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

#box {
  display: flex;
  justify-content: flex-start;
  margin: 0;
  height: 100vh;
  box-shadow: 0 2px 2px 0 #c0c0c0, 2px 5px 5px 0 #c0c0c0;
}

/* IONIC CHANGES */
/* IONIC CHANGES */
  .content-area {
    --offset-bottom: 58px;
  }
/* IONIC CHANGES */
/* IONIC CHANGES */

/* IPAD issues */
/* 100vh doen't work in ipad */
.is-safari #box {
  height: -webkit-fill-available;
}
/* keyboard overlaps bottom input */
.is-safari #item-add:focus-within {
  margin-bottom: 40px;
  z-index: 100;
}
/* single page e.g. user pages */
#single {
  min-width: 250px;
  max-width: 400px;
}

@media (min-width: 505px) {
  #single {
    margin-top: 20px !important;
    margin: 0 auto;
    height: calc(100vh - 40px);
  }
}

/* min width for outer box _NOT_ for phones */
@media (min-width: 400px) {
  #box.app {
    min-width: 640px;
    min-width: 500px;
    max-width: 1200px;
  }
  #box.user {
    min-width: 400px;
    min-width: 400px;
    max-width: 400px;
  }
  .single.column {
    min-width: 250px;
  }
  .left.column {
    min-width: 250px;
  }
  .middle.column {
    min-width: 250px;
  }
  .right.column {
    min-width: 250px;
  }
}

@media (min-width: 400px) {
  .WebPage {
    height: calc(100vh - 125px);
  }
  #box.app {
    margin-top: 0px !important;
    margin: 0 auto;
    height: calc(100vh);
  }
}

/* large normal view */
@media (min-width: 1225px) {
  #box.app {
    margin-top: 20px !important;
    margin: 0 auto;
    height: calc(100vh - 40px);
  }
  .WebPage {
    border:10px solid blue;
    height: calc(100vh - 167px);
  }
}

/* hide middle column at certain width if right column is displayed only */
@media (max-width: 800px) {
  .right.column:not(.hide) ~ .middle.column {
    display: none;
  }
}
.column {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
  background: #fff;
}
.single.column {
  flex: 1;
  xmax-width: 250px;
  xjustify-self: center;
  xalign-self: center;
}
.left.column {
  order: 1;
  flex: 8;
}
.middle.column {
  border-left: 1px dashed #c0c0c0 !important;
  order: 2;
  flex: 8;
}
.right.column {
  border-left: 1px dashed #c0c0c0 !important;
  order: 3;
  flex: 8;
}
</style>
