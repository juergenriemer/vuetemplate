import Vue from "vue";
import Router from "vue-router";
import TodoItemIndex from "@/components/TodoItem/Index";
import Register from "@/components/User/Register";
import Login from "@/components/User/Login";
import Logout from "@/components/User/Logout";

Vue.use(Router);

export default new Router({
  // NB: browser back/forward not triggering when console is open!
  routes: [
    {
      path: "/register",
      name: "Register",
      component: Register
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/logout",
      name: "Logout",
      component: Logout
    },
    {
      path: "/",
      name: "TodoItemIndex",
      component: TodoItemIndex
    }
  ]
});
