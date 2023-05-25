<template>
  <div class="abstract-tile-wrapper">
    <v-icon color="primary">mdi-file-document-arrow-right</v-icon>
    <h1>{{ $t('theseView.resume') }}</h1>
    <!--    language selector-->
  </div>
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