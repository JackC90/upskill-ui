<template>
  <AdvancedChat v-if="user" :userId="user.id" :username="user.username" />
  <AuthPage v-else></AuthPage>
</template>

<script>
import { onMounted } from "vue";
import { register } from "vue-advanced-chat";
import AuthPage from "@/components/auth/AuthPage.vue";
import AdvancedChat from "@/components/chat/AdvancedChat/AdvancedChat.vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";

register();

export default {
  components: { AuthPage, AdvancedChat },
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
