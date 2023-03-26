<template>
  <div>
    <form @submit.prevent="submitLogin">
      <FormKit
        type="text"
        label="User name"
        :validation="[['required']]"
        v-model="data.username"
      />

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

      <FormKit type="submit">Sign Up</FormKit>
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
      username: null,
      email: null,
      password: null,
    });

    return {
      data,
      submitSignup() {
        emit("submitSignup", data.value);
      },
    };
  },
};
</script>
