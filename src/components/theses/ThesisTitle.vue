<template>
  <div v-if="currentTitle !== ''" class="title-wrapper line-clamp">
    <div class="thesis-icon">
      <thesis-icon :status="status"></thesis-icon>
    </div>
    <div class="title-flexbox"> <!-- #TODO v-if anglais/francais -->
      <span>
        {{ currentTitle }}
      </span><language-selector :languages="langList" @update-langue="onUpdateLangue"></language-selector>
    </div>
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
  padding: 20px 20px 10px 10px;
  display: grid !important;
  grid-template-columns: 2fr 20fr;
}

.thesis-icon {
  align-self: start;
  justify-self: center;
}

.title-flexbox {
  display: flex;
  flex-flow: row wrap;

  span {
    font-family: Roboto-Medium, sans-serif;
    font-size: 25.5px;
    font-weight: 600;
    letter-spacing: -0.5px;
    line-height: 1.2;
  }
}
</style>