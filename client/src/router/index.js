import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import ListsPage from "../pages/ListsPage.vue";
import ItemsPage from "../pages/ItemsPage.vue";
import ListInfoPage from "../pages/ListInfoPage.vue";
import ListMembersPage from "../pages/ListMembersPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import TestPage from "../pages/TestPage.vue";

const routes = [
  {
    path: "/",
    redirect: "/mob/lists",
  },
  {
    path: "/web/lists/",
    //alias: ["/web/list/items/:listId", "/web/list/info/:listId"],
    component: TestPage,
  },
  {
    path: "/web/list/items/:listId",
    component: TestPage,
  },
  {
    path: "/web/list/info/:listId",
    component: TestPage,
    props: { comp: "ListInfoPage", comp2: ListInfoPage },
  },
  {
    path: "/web/list/members/:listId",
    component: TestPage,
    props: { comp: "ListMembersPage", comp2: ListMembersPage },
  },
  {
    path: "/mob/lists",
    component: ListsPage,
  },
  {
    path: "/mob/list/items/:listId",
    component: ItemsPage,
  },
  {
    path: "/mob/list/info/:listId",
    component: ListInfoPage,
  },
  {
    path: "/mob/list/members/:listId",
    component: () => import("@/pages/ListMembersPage.vue"),
  },
  {
    path: "/mob/list/add",
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
