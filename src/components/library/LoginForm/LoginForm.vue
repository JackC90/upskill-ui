<template>
  <div>
    <form @submit.prevent="submitLogin">
      <FormKit
        type="email"
        label="Email"
        :validation="[['required']]"
        v-model="data.email"
      />

      <FormKit
        type="password"
        label="Password"
        :validation="[['required']]"
        v-model="data.password"
      />

      <FormKit type="submit">Login</FormKit>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { FormKit } from "@formkit/vue";

export default {
  components: {
    FormKit,
  },
  setup(props, { emit }) {
    const data = ref({
      email: null,
      password: null,
    });

    return {
      data,
      submitLogin() {
        emit("submitLogin", data.value);
      },
    };
  },
};
</script>
