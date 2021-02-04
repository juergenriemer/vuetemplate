import Vue from "vue";
import Router from "vue-router";
import MainIndex from "@/components/Main/MainIndex";
import Register from "@/components/User/Register";
import VerifyRegistration from "@/components/User/RegisterVerify";
import Login from "@/components/User/Login";

Vue.use(Router);

export default new Router({
  // NB: browser back/forward not triggering when console is open!
  routes: [
    {
      path: "/verify-registration/:token",
      name: "VerifyRegistration",
      component: VerifyRegistration
    },
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
      path: "/main",
      name: "MainIndex",
      component: MainIndex
    },
    {
      path: "/main/:id",
      name: "MainIndex",
      component: MainIndex
    },
    {
      path: "/",
      name: "MainIndex",
      component: MainIndex
    }
  ]
});
