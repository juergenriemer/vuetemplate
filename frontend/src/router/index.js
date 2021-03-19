import Vue from "vue";
import Router from "vue-router";
import MainIndex from "@/components/Main/MainIndex";
import Register from "@/components/User/Register";
import ResetPassword from "@/components/User/ResetPassword";
import ResetPasswordVerify from "@/components/User/ResetPasswordVerify";
import RegisterVerifyResend from "@/components/User/RegisterVerifyResend";
import ApproveInvitesSingle from "@/components/User/ApproveInvitesSingle";
import RegisterVerify from "@/components/User/RegisterVerify";
import VerifyInvitation from "@/components/List/ShareVerify";
import Login from "@/components/User/Login";
const isLoggedIn = () => localStorage.getItem("token");

Vue.use(Router);

export default new Router({
  // NB: browser back/forward not triggering when console is open!
  routes: [
    {
      path: "/verify-invitation/:token",
      name: "VerifyInvitation",
      component: VerifyInvitation,
      beforeEnter: (to, from, next) => {
        if (!isLoggedIn()) next("/login");
        next();
      }
    },
    {
      path: "/register-verify/:token",
      name: "RegisterVerify",
      component: RegisterVerify
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
      path: "/resend-verification",
      name: "RegisterVerifyResend",
      component: RegisterVerifyResend
    },
    {
      path: "/approve-invites",
      name: "ApproveInvitesSingle",
      component: ApproveInvitesSingle
    },
    {
      path: "/reset-password",
      name: "ResetPassword",
      component: ResetPassword
    },
    {
      path: "/reset-password-verify/:token",
      name: "ResetPasswordVerify",
      component: ResetPasswordVerify
    },
    {
      path: "/main",
      name: "MainIndex",
      component: MainIndex,
      beforeEnter: (to, from, next) => {
        if (!isLoggedIn()) next("/login");
        next();
      }
    },
    {
      path: "/main/:id",
      name: "MainIndex",
      component: MainIndex,
      beforeEnter: (to, from, next) => {
        if (!isLoggedIn()) next("/login");
        next();
      }
    },
    {
      path: "/",
      name: "MainIndex",
      component: MainIndex,
      beforeEnter: (to, from, next) => {
        if (!isLoggedIn()) next("/login");
        next();
      }
    }
  ]
});
