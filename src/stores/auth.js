import { defineStore } from "pinia";
import jwt_decode from "jwt-decode";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({ user: null }),

  actions: {
    async init() {
      try {
        const token = localStorage.getItem("token");
        let user;
        if (token) {
          user = jwt_decode(token);
        }

        if (user) {
          // Call user
          const _userInfo = await axios.get("/user");
          if (_userInfo) {
            this.user = user;
          } else {
            await this.onLogout();
          }
        }
      } catch (err) {
        this.onLogout();
        throw Error(err);
      }
    },
    async onRegister(values) {
      try {
        const resp = await axios.post("/register", values);
        const token = resp.data.token;
        localStorage.setItem("token", token);

        let user;
        if (token) {
          user = jwt_decode(token);
        }
        this.user = user;
      } catch (err) {
        throw Error(err);
      }
    },
    async onLogin(values) {
      try {
        const resp = await axios.post("/login", values);
        const token = resp.data.token;
        localStorage.setItem("token", token);

        let user;
        if (token) {
          user = jwt_decode(token);
        }
        this.user = user;
        return user;
      } catch (err) {
        throw Error(err);
      }
    },
    async onLogout() {
      await axios.post("/logout");
      localStorage.removeItem("token");
      this.user = null;
    },
  },
});
