import Vue from "vue";
import VueRouter from "vue-router";
import home from "../views/home.vue";
import distributor from "../views/distributor.vue";
import retailer from "../views/retailer.vue";
import verify from "../views/verify.vue";
import verified from "../views/verified.vue";
import add from "../views/add.vue";
import complaints from "../views/complaints";
import order from "../views/order";
import orderHistory from "../views/orderHistory";
import drugListr from "../views/drugListr";
import complain from "../views/complain";
import orderList from "../views/orderList";
import drugListd from "../views/drugListd";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: home,
  },
  {
    path: "/distributor",
    name: "distributor",
    component: distributor,
  },
  {
    path: "/retailer",
    name: "retailer",
    component: retailer,
  },
  {
    path: "/add",
    name: "add",
    component: add,
  },
  {
    path: "/verify",
    name: "verify",
    component: verify,
  },
  {
    path: "/verified/:verifyCode",
    name: "verified",
    component: verified,
  },
  {
    path: "/complaints",
    name: "complaints",
    component: complaints,
  },
  {
    path: "/order",
    name: "order",
    component: order,
  },
  {
    path: "/order-history",
    name: "orderHistory",
    component: orderHistory,
  },
  {
    path: "/inventory-rtl",
    name: "drugListr",
    component: drugListr,
  },
  {
    path: "/inventory-dst",
    name: "drugListd",
    component: drugListd,
  },
  {
    path: "/complain",
    name: "complain",
    component: complain,
  },
  {
    path: "/order-list",
    name: "orderList",
    component: orderList,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
