<template>
  <ChatWindow v-if="user" />
  <AuthPage v-else></AuthPage>
</template>

<script>
import "ant-design-vue/es/form/style/css";
import "ant-design-vue/es/button/style/css";
import "ant-design-vue/es/input/style/css";
import "ant-design-vue/es/card/style/css";

import { onMounted } from "vue";
import AuthPage from "@/components/auth/AuthPage.vue";
import ChatWindow from "@/components/chat/ChatWindow/ChatWindow.vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";

export default {
  components: { AuthPage, ChatWindow },
  name: "App",
  setup() {
    const { user } = storeToRefs(useAuthStore());
    const { init } = useAuthStore();

    onMounted(async () => {
      init();
    });

    return {
      user,
    };
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat");

#app {
  font-family: Montserrat, Helvetica, Arial, sans-serif;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  width: 100vw;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

::-webkit-scrollbar {
  width: 10px;
  background-color: #f5f5f5;
}

::-webkit-scrollbar:horizontal {
  height: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #1976d2;
}
</style>
