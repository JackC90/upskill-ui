<template>
  <div>
    <LoginForm v-if="mode === 'login'" @submitLogin="submitLogin"></LoginForm>
    <SignupForm
      v-if="mode === 'register'"
      @submitSignup="submitSignup"
    ></SignupForm>

    <div>
      <p v-if="mode === 'login'">
        Haven't registered for an account?
        <button @click="toggleMode">Create one now</button>
      </p>
      <p v-else>
        Have an account? <button @click="toggleMode">Log in now</button>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth.js";
import LoginForm from "@/components/library/LoginForm/LoginForm.vue";
import SignupForm from "@/components/library/SignupForm/SignupForm.vue";

// import { storeToRefs } from "pinia";

export default {
  components: {
    LoginForm,
    SignupForm,
  },
  setup() {
    // const { user } = storeToRefs(useAuthStore());
    const { onLogin, onRegister } = useAuthStore();

    const mode = ref("login");

    const toggleMode = () => {
      mode.value = mode.value === "register" ? "login" : "register";
    };

    return {
      mode,
      toggleMode,
      submitLogin: onLogin,
      submitSignup: onRegister,
    };
  },
};
</script>
