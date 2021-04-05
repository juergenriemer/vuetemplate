import { createRouter, createWebHistory } from "@ionic/vue-router";
//import { RouteRecordRaw } from "vue-router";
//import ListsPage from "../pages/ListsPage.vue";
//import ItemsPage from "../pages/ItemsPage.vue";
import WebView from "../views/Web.vue";
//import MobileView from "../views/Mobile.vue";
const View = self.isWeb ? WebView : WebView;
const routes =
  1 == 1
    ? [
        {
          path: "/:mode/:page",
          component: View,
        },
        {
          path: "/:mode/:page/:id",
          component: View,
        },
      ]
    : [];
/*
const routes = isWeb
  ? [
      {
        path: "/",
        redirect: "/mob/list",
      },
      {
        path: "/:page/:listId",
        component: TestPage,
      },
      {
        path: "/web",
        redirect: "/web/list",
      },
      {
        path: "/web/list/",
        component: TestPage,
      },
      {
        path: "/web/list/:page",
        component: TestPage,
      },
      {
        path: "/web/list/:page/:listId",
        component: TestPage,
      },
    ]
  : [
      {
        path: "/mob/list",
        component: ListsPage,
      },
      {
        path: "/mob/list/items/:listId",
        component: ItemsPage,
      },
      {
        path: "/mob/list/add",
        component: () => import("@/pages/AddListPage.vue"),
      },
      {
        path: "/mob/list/info/:listId",
        component: () => import("@/pages/ListInfoPage.vue"),
      },
      {
        path: "/mob/list/members/:listId",
        component: () => import("@/pages/ListMembersPage.vue"),
      },
      {
        path: "/mob/list/edit/:listId",
        component: () => import("@/pages/EditListPage.vue"),
      },
      {
        path: "/web/login",
        component: LoginPage,
      },
      {
        path: "/mob/login",
        component: LoginPage,
      },
    ];
*/
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
