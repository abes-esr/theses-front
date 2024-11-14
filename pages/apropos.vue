<template>
</template>

<script setup>
// Redirection automatique vers la page dans la bonne langue
import { useRouter } from "nuxt/app";

const router = useRouter();

onMounted(() => {
  router.push(localStorage.getItem("language") + '/apropos');
  }
);
</script>