import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import ListsPage from "../pages/ListsPage.vue";
import ItemsPage from "../pages/ItemsPage.vue";
import ListInfoPage from "../pages/ListInfoPage.vue";
import LoginPage from "../pages/LoginPage.vue";

const routes = [
  {
    path: "/",
    redirect: "/lists",
  },
  {
    path: "/lists",
    component: ListsPage,
  },
  {
    path: "/lists/:listId",
    component: ItemsPage,
  },
  {
    path: "/lists/info/:listId",
    component: ListInfoPage,
  },
  {
    path: "/lists/members/:listId",
    component: () => import("@/pages/ListMembersPage.vue"),
  },
  {
    path: "/lists/add",
    component: () => import("@/pages/AddListPage.vue"),
  },
  {
    path: "/login",
    component: LoginPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
