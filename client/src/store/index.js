import Vue from "vue";
import Vuex from "vuex";
import AuthService from "@/services/auth";

const token = localStorage.getItem("jwt_token");
const user = localStorage.getItem("user");
const initialState =
  token && token != ""
    ? { loggedIn: true, token: token, user: JSON.parse(user) }
    : { loggedIn: false, token: null, user: null };

Vue.use(Vuex);

export default new Vuex.Store({
  state: initialState, // state of the application. can store anything i.e., objects, strings
  actions: {
    // make requests to api but will commit to mutations
    login({ commit }, user) {
      return AuthService.login(user)
        .then((data) => {
          console.log("Got token from service: " + JSON.stringify(data.token));
          localStorage.setItem("jwt_token", data.token);
          commit("SET_TOKEN", data.token);
          commit("SET_AUTH", true);
          delete data.token;
          delete data.success;
          localStorage.setItem("user", JSON.stringify(data));
          commit("SET_USER", data);
          return Promise.resolve();
        })
        .catch((err) => {
          console.log("Login failed");
          commit("SET_TOKEN", null);
          commit("SET_AUTH", false);
          commit("SET_USER", null);
          console.log(err);
          return Promise.reject(err);
        });
    },
    logout({ commit }) {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user");
      commit("SET_TOKEN", null);
      commit("SET_AUTH", false);
      commit("SET_USER", null);
    },
  },
  mutations: {
    // updates the state
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_AUTH(state, auth) {
      state.loggedIn = auth;
    },
    SET_USER(state, data) {
      state.user = data;
    },
  },
  getters: {
    loggedIn: (state) => state.loggedIn,
    token: (state) => state.token,
    user: (state) => state.user,
  },
  modules: {},
});
