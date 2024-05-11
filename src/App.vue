<script setup>
import { RouterView } from 'vue-router';
import {onMounted} from "vue";
import router from "@/router";

onMounted(()=>{
  router.push('/')
})

</script>

<template>

  <RouterView />

</template>

