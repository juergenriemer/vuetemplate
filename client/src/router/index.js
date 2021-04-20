import { createRouter, createWebHistory } from "@ionic/vue-router";
//import { RouteRecordRaw } from "vue-router";
import ListsPage from "@/pages/app/ListsPage.vue";
import ItemsPage from "@/pages/app/ItemsPage.vue";
import Login from "@/pages/user/Login.vue";

import store from "../store";
import WebView from "../views/Web.vue";
//import MobileView from "../views/Mobile.vue";
const View = self.isWeb ? WebView : WebView;

const ensureData = (to, next) => {
  let noData = !(store && store.getters && store.getters.userId);
  if (noData) {
    store
      .dispatch("info")
      .then(() => {
        return store.dispatch("fetchLists");
      })
      .then((res) => {
        next();
      });
  } else {
    next();
  }
};
const routes = self.isWeb
  ? [
      {
        path: "/",
        redirect: "/app/list",
      },
      {
        path: "/user/:page",
        component: View,
      },
      {
        path: "/user/:page/:id",
        component: View,
      },
      {
        path: "/app/:page",
        component: View,
        beforeEnter: (to, from, next) => {
          ensureData(to, next);
        },
      },
      {
        path: "/app/:page/:id",
        component: View,
        beforeEnter: (to, from, next) => {
          ensureData(to, next);
        },
      },
    ]
  : [
      {
        path: "/",
        redirect: "/app/list",
      },
      {
        path: "/app/list",
        component: ListsPage,
        beforeEnter: (to, from, next) => {
          ensureData(to, next);
        },
      },
      {
        path: "/app/items/:id",
        component: ItemsPage,
      },
      {
        path: "/app/add",
        component: () => import("@/pages/app/AddListPage.vue"),
      },
      {
        path: "/app/info/:id",
        component: () => import("@/pages/app/ListInfoPage.vue"),
      },
      {
        path: "/app/members/:id",
        component: () => import("@/pages/app/ListMembersPage.vue"),
      },
      {
        path: "/app/edit/:id",
        component: () => import("@/pages/app/EditListPage.vue"),
      },
      {
        path: "/app/comments/:id/:itemId",
        component: () => import("@/pages/app/CommentsPage.vue"),
      },
      {
        path: "/app/memberships/:id",
        component: () => import("@/pages/app/MembershipPage.vue"),
      },
      {
        path: "/app/memberships",
        component: () => import("@/pages/app/MembershipPage.vue"),
      },
      {
        path: "/app/picture/:id/:itemId/:imageFile",
        component: () => import("@/pages/app/Picture.vue"),
      },
      {
        path: "/user/login",
        component: Login,
      },
      {
        path: "/user/register",
        component: () => import("@/pages/user/Register.vue"),
      },
      {
        path: "/user/register-verify",
        component: () => import("@/pages/user/RegisterVerify.vue"),
      },
      {
        path: "/user/reset-password",
        alias: "/app/reset-password",
        component: () => import("@/pages/user/ResetPassword.vue"),
      },
      {
        path: "/user/reset-password-verify",
        component: () => import("@/pages/user/ResetPasswordVerify.vue"),
      },
      {
        path: "/user/approve-invites",
        alias: "/app/approve-invites",
        component: () => import("@/pages/user/ApproveInvites.vue"),
      },
    ];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
