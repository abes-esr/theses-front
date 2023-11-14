<template>
  <div v-if="currentTitle !== ''" class="title-wrapper line-clamp">
    <div class="thesis-icon">
      <ThesesResultsThesisIcon :status="status"></ThesesResultsThesisIcon>
    </div>
    <div class="title-flexbox">
      <span :class="isRtl ? 'rtl-text' : ''">
        {{ currentTitle }}
      </span>
      <CommonLanguageSelector class="language-selector" :languages="langList" @update-langue="onUpdateLangue">
      </CommonLanguageSelector>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { LanguesRTL } from "../../services/Common";

const props = defineProps({
  titles: {
    type: Object,
    required: true,
    default: new Object
  },
  status: {
    type: String,
    required: true
  }
});

const currentTitle = ref("");
const selectedLanguage = ref("fr");
const isRtl = ref(false);

currentTitle.value = props.titles[selectedLanguage.value];

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
  isRtl.value = LanguesRTL.includes(selectedLanguage.value.toLowerCase());
}



</script>

<style lang="scss" scoped>
@use 'vuetify/settings';

.title-wrapper {
  padding: 1.2em 1.2em 1em 1em;
  grid-column-start: 1;
  grid-column-end: 4;

  display: flex;
  align-content: flex-end;
}

.thesis-icon {
  align-self: start;
  justify-self: center;
}

.title-flexbox {
  display: flex;
  grid-column-start: 2;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    flex-direction: column;
  }

  span {
    font-family: Roboto-Medium, sans-serif;
    font-size: 25.5px;
    font-weight: 600;
    color: rgb(var(--v-theme-text-dark-blue));
    letter-spacing: -0.5px;
    line-height: 1.2;
    align-self: end;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
      font-size: 21px;
      margin-top: 0.3em;
    }
  }
}

.language-selector {
  justify-content: center;
  align-self: end;
}
</style>