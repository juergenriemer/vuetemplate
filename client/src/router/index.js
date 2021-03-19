import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import ListsPage from "../pages/ListsPage.vue";
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
    path: "/lists/add",
    component: () => import("../pages/AddListPage.vue"),
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
