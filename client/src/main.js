import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";

axios.defaults.baseURL = "api/";
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
  // mounted() {
  //   axios.interceptors.response.use(response => {
  //     return response;
  //   }, error => {
  //     if (401 === error.response.status) {
  //         store.dispatch('logout'); // something wrong
  //         router.push('/');
  //     }
  //     return Promise.reject(error);
  //   });
  // }
}).$mount("#app");
