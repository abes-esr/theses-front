<template>
  <div>
    <div v-if="resumeIsSet && dataReady">
      <div class="resume-title-wrapper">
        <v-icon color="primary">mdi-file-document-arrow-right</v-icon>
        <h1>{{ $t('theseView.resume') }}</h1>
        <language-selector :languages="langList" @update-langue="onUpdateLangue"></language-selector>
      </div>
      <div id="resume-text">
        <p>
          {{ resume }}
        </p>
      </div>
    </div>
    <div v-if="!dataReady">
      <v-skeleton-loader type="article"></v-skeleton-loader>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUpdate, ref, computed } from "vue";
import LanguageSelector from "../common/LanguageSelector.vue";

const props = defineProps({
  these: {
    type: Object
  },
  resumeIsSet: {
    type: Boolean
  },
  dataReady: {
    type: Boolean,
    default: false
  },
});

const resume = ref("");
const selectedLanguage = ref("fr");

onBeforeUpdate(() => {
  if (typeof props.these.resumes !== 'undefined' && typeof props.these.resumes[selectedLanguage.value] !== 'undefined') {
    resume.value = props.these.resumes[selectedLanguage.value];
  }
});

/** 
 * Computed
 */
const langList = computed(() => {
  return Object.keys(props.these.resumes);
});

/**
 * Functions
 */
function onUpdateLangue(langue) {
  selectedLanguage.value = langue;
  resume.value = props.these.resumes[selectedLanguage.value];
}
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.resume-title-wrapper {
  display: inline-flex;
  align-items: center;
}

h1 {
  font-size: 24px;
  margin-left: 5px;

  font-family: Roboto-Bold, sans-serif;
  font-weight: 700;
  letter-spacing: 0px;
  color: rgb(var(--v-theme-text-dark-blue))
}

p {
  text-align: justify;

  font-size: 16px;
  font-family: Roboto-Regular, sans-serif;
  font-weight: 400;
  letter-spacing: 0px;
  color: rgb(var(--v-theme-text-dark-blue));
}

#resume-text {
  margin: 0 10px;
  word-break: break-word;
}

.mdi-file-document-arrow-right.v-icon--size-default {
  font-size: 25px;
  width: 35px;
}

.toggle-up-down {
  transition: transform .3s ease-in-out !important;
}

.toggle-up-down.rotate {
  transform: rotate(180deg);
}
</style>