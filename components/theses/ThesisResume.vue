<template>
    <div>
      <div class="resume-title-wrapper">
        <v-icon color="primary">mdi-file-document-arrow-right</v-icon>
        <h2>{{ $t('theseView.resume') }}</h2>
        <CommonLanguageSelector :languages="langList" @update-langue="onUpdateLangue"></CommonLanguageSelector>
      </div>
      <div id="resume-text" :class="isRtl ? 'rtl-text' : ''">
        <p>
          {{ resume }}
        </p>
      </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { LanguesRTL } from "../../services/Common";

const props = defineProps({
  these: {
    type: Object
  }
});

const server = ref(false);
if (process.server) {
  server.value = true;
}

const resume = ref("");
const selectedLanguage = ref("fr");

if (typeof props.these.resumes !== 'undefined' && typeof props.these.resumes[selectedLanguage.value] !== 'undefined') {
  resume.value = props.these.resumes[selectedLanguage.value];
}

/** 
 * Computed
 */
const langList = computed(() => {
  if (props.these.resumes)
    return Object.keys(props.these.resumes);
  else return [];
});

/**
 * Functions
 */
const isRtl = ref(false);

function onUpdateLangue(langue) {
  selectedLanguage.value = langue;
  resume.value = props.these.resumes[selectedLanguage.value];
  LanguesRTL.includes(selectedLanguage.value.toLowerCase()) ? isRtl.value = true : isRtl.value = false;
}
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.resume-title-wrapper {
  display: inline-flex;
  align-items: center;
}

h2 {
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