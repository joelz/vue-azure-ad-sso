<template>
  <h2>Login Page</h2>
</template>
<script>
import { getEnv } from "@/utils/index";

export default {
  name: "App",
  data() {
    return {
      variable1: getEnv("VUE_APP_VARIABLE_1"),
      apiBase: getEnv("VUE_APP_BASE_API"),
    };
  },
  methods: {
  }
};
</script>
<style>
</style>
