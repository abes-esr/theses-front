<template>
  <div v-if="currentTitle !== ''" class="title-wrapper line-clamp">
    <div class="thesis-icon">
      <ThesesResultsThesisIcon :status="status"></ThesesResultsThesisIcon>
    </div>
    <div class="title-flexbox" ref="firstFocusElement" aria-labelledby="thesis-title" tabindex="-1">
      <h1 :class="isRtl ? 'rtl-text' : ''" id="thesis-title">
        {{ currentTitle }}
      </h1>
      <CommonLanguageSelector class="language-selector" :languages="langList" @update-langue="onUpdateLangue">
      </CommonLanguageSelector>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
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

const selectedLanguage = ref("fr");
const isRtl = ref(false);

const currentTitle = computed(() => {
  // Si pas de fr, utiliser la première langue disponible
  if (!props.titles[selectedLanguage.value]) {
    selectedLanguage.value = Object.keys(props.titles)[0];
  }
  return props.titles[selectedLanguage.value];
});

const firstFocusElement = ref(null);

// Focus sur le contenu de la page au chargement
onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      if (firstFocusElement.value) {
        firstFocusElement.value.focus({ focusVisible: false });
      }
    }, 100);
  });
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

  h1 {
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