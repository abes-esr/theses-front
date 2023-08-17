<template>
  <div v-if="currentTitle !== '' && dataReady" class="title-wrapper line-clamp">
    <div class="thesis-icon">
      <thesis-icon :status="status"></thesis-icon>
    </div>
    <div class="title-flexbox"> <!-- #TODO v-if anglais/francais -->
      <span>
        {{ currentTitle }}
      </span>
      <language-selector class="language-selector" :languages="langList" @update-langue="onUpdateLangue"></language-selector>
    </div>
  </div>
  <div v-if="!dataReady" class="title-wrapper line-clamp">
    <v-skeleton-loader type="list-item-avatar" class="w-100"></v-skeleton-loader>
  </div>
</template>

<script setup>
import { onBeforeUpdate, ref, computed } from "vue";
import ThesisIcon from "@/components/theses/results/ThesisIcon.vue";
import LanguageSelector from "../common/LanguageSelector.vue";

const props = defineProps({
  titles: {
    type: Object,
    required: true,
    default: new Object
  },
  status: {
    type: String,
    required: true
  },
  dataReady: {
    type: Boolean
  }
});

const currentTitle = ref("");
const selectedLanguage = ref("fr");

onBeforeUpdate(() => {
  currentTitle.value = props.titles[selectedLanguage.value];
});

/**
 * Computed Properties
 */

const langList = computed(() => {
  return Object.keys(props.titles);
});

/**
 * Functions
 *  */
function onUpdateLangue(langue) {
  selectedLanguage.value = langue;
  currentTitle.value = props.titles[selectedLanguage.value];
}



</script>

<style lang="scss" scoped>
@use 'vuetify/settings';

.title-wrapper {
  padding: 1.2em 1.2em 1em 1em;
  grid-column-start: 1;
  grid-column-end: 4;

  display: flex;
  align-content: end;
}

.thesis-icon {
  align-self: start;
  justify-self: center;
}

.title-flexbox {
  display: grid;
  grid-template-columns: 9fr 1fr;
  grid-column-start: 2;

  span {
    font-family: Roboto-Medium, sans-serif;
    font-size: 25.5px;
    font-weight: 600;
    color: rgb(var(--v-theme-text-dark-blue));
    letter-spacing: -0.5px;
    line-height: 1.2;
    align-self: end;
  }
}

.language-selector {
  justify-content: center;
  align-self: end;
}
</style>