<template>

</template>

<script setup>
import { watch } from "vue";

const props = defineProps({
  selectedLanguage: {
    type: String,
    default: 'fr'
  }
});

watch(() => props.selectedLanguage, async (newSelected) => {
  // for (const [key, value] of Object.entries(these.value.resumes)) {
  //   if (key === newSelected)
  //     resume.value = value;
  // }
});

</script>

<style scoped>

</style>