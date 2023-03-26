import { createApp } from "vue";
import { createPinia } from "pinia";
import { plugin, defaultConfig } from "@formkit/vue";
import App from "./App.vue";
import axios from "./plugins/axios";

const app = createApp(App);

app
  .use(createPinia())
  .use(axios, {
    baseUrl: process.env.VUE_APP_API,
  })
  // FormKit
  .use(plugin, defaultConfig);

app.mount("#app");
