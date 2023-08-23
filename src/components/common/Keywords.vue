<template>
  <div>
    <div v-if="keywordsAreSet && dataReady">
      <div class="key-words-title-wrapper">
        <div class="title">
          <v-icon color="primary">mdi-list-box</v-icon>
          <h1>{{ $t('theseView.motcle') }}</h1>
          <language-selector :languages="langList" @update-langue="onUpdateLangue"></language-selector>
        </div>
        <v-btn class="info-button" flat icon="mdi-information-outline">
        </v-btn>
        <v-overlay activator=".info-button" location-strategy="connected" scroll-strategy="close">
          <v-card class="legend-tooltip">
            <h1>Légende</h1>
            <v-chip-group>
              <v-chip label class="rameau-chip"><span class="key-word-label">mot-clé contrôlé</span></v-chip>
              <v-chip label class="free-chip">mot-clé libre</v-chip>
            </v-chip-group>
          </v-card>
        </v-overlay>
      </div>
        <v-chip-group class="chip-lines">
          <v-chip label v-for="keyWord in selectKeyWords()" :key="keyWord.keyword + forceRenderKey"
            :title="keyWord.keyword" :class="keyWord.type === 'sujetsRameau' ? 'rameau-chip' : 'free-chip'"
            :disabled="keyWord.type === 'sujetsRameau' ? false : true"
            @click="if(keyWord.type === 'sujetsRameau') $router.push({ name: 'resultats', query: { q: keyWord.query ? keyWord.query : keyWord.keyword, domaine: 'theses' } });">
            <span class="key-word-label">{{ keyWord.keyword }}</span>
          </v-chip>
        </v-chip-group>
      <div id="key-words-button-wrapper">
        <v-btn v-if="numberOfKeywords > numberOfKeywordsPerLine && keywords[selectedLanguage].length > numberOfKeywordsPerLine"
               class="read-more-less-button" variant="outlined" @click="narrowDownKeywords" flat>
          <span></span>
          <span>{{ $t('theseView.showLessKeywords') }}</span>
          <v-icon class="toggle-up-down" :class='{ "rotate": readMore }'>mdi-arrow-down-circle-outline</v-icon>
        </v-btn>
        <v-btn v-if="numberOfKeywords < keywords[selectedLanguage].length"
               class="read-more-less-button" variant="outlined" @click="addTenKeywords" flat>
          <span></span>
          <span>{{ $t('theseView.showMoreKeywords') }}</span>
          <v-icon class="toggle-up-down" :class='{ "rotate": readMore }'>mdi-arrow-down-circle-outline</v-icon>
        </v-btn>
      </div>
    </div>
    <div v-if="!dataReady">
      <v-skeleton-loader type="table-row" class="px-4"></v-skeleton-loader>
      <v-skeleton-loader type="button" class="d-flex flex-row-reverse pe-7 w-25"></v-skeleton-loader>
    </div>
  </div>
</template>

<script setup>
import {onBeforeUpdate, ref, watch, computed, onBeforeMount} from "vue";
import { useDisplay } from "vuetify";
import LanguageSelector from "./LanguageSelector.vue";

const props = defineProps({
  these: {
    type: Object,
    required: true
  },
  dataReady: {
    type: Boolean
  },
  keywordsAreSet: {
    type: Boolean
  }
});

const { mobile } = useDisplay();

const numberOfKeywordsPerLine = mobile.value ? ref(6) : ref(5);
const numberOfKeywords = mobile.value ? ref(6) : ref(5);
const forceRenderKey = ref(0);

const keywords = ref([]);
const increment = ref(10);
const selectedLanguage = ref("fr");

onBeforeUpdate(() => {
  setKeywords();
});

onBeforeMount(() => {
  setKeywords();
});

/**
 * Computed Properties
 */

const langList = computed(() => {
  return Object.keys(keywords.value);
});

/**
 * Functions
 */

/**
 * définit les lignes de mots clés à afficher (première ligne et seconde)
 * @param numberOfWords
 * @param offset
 * @returns {UnwrapRefSimple<*>[]}
 */
function selectKeyWords() {
  return keywords.value[selectedLanguage.value].filter((word, index) => { return index < numberOfKeywords.value && index >= 0; });
}

/*
* Format attendu : 
sujets["langue"] = [
  {
  keyword: libelle,
  type: sujetRameau | sujet
  query: requête rebond ES
  }
]
*/
function setKeywords() {
  keywords.value = props.these.mapSujets;
}

function onUpdateLangue(langue) {
  selectedLanguage.value = langue;
}

function addTenKeywords() {
  numberOfKeywords.value += increment.value;
}

function narrowDownKeywords() {
  numberOfKeywords.value = numberOfKeywordsPerLine.value;
}
/**
 * Watchers
 */
watch(mobile, (newValue) => {
  numberOfKeywordsPerLine.value = newValue ? 6 : 5;

  forceRenderKey.value++;
});
</script>

<style scoped lang="scss">
@use '../../../node_modules/vuetify/settings';

.chip-lines :deep(.v-chip--disabled) {
  opacity: unset;
  pointer-events: unset;
}

.v-chip-group {
  margin-top: unset !important;
}

.chip-lines {
  flex-wrap: wrap !important;
}

.key-words-title-wrapper {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.4em 0 0.8em 0;
}

.title {
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

.mdi-list-box.v-icon--size-default {
  font-size: 30px;
  width: 35px;
}

.v-chip-group {
  margin-top: 0.5em;
  padding: 0;
  justify-content: start;
  flex-wrap: nowrap;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .free-chip {
    background-color: rgb(var(--v-theme-secondary-darken-2)) !important;
  }

  .rameau-chip {
    background-color: rgb(var(--v-theme-orange-abes)) !important;
  }
}

#second-chip-line {
  flex-wrap: wrap !important;
}

.v-chip {
  justify-content: center;
  width: 18.5%;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    width: 46%;
  }
}

.v-chip--label {
  font-family: Roboto Black, sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: rgb(var(--v-theme-surface));
}

.v-chip--disabled {
  background-color: rgb(var(--v-theme-gris-clair));
}

.key-word-label {
  width: 100%;
  padding: 0 5px;

  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}


#key-words-button-wrapper {
  display: flex;
  justify-content: end;
}

.read-more-less-button {
  margin: 1em 1em 0 0;
  text-transform: none;
  display: inline-flex;
  padding: 0 1em;
  letter-spacing: 0.5px;

  :deep(.v-btn__content) {
    width: 100%;
    justify-content: space-between;

    i {
      margin-left: 0.3em;
    }
  }
}

.toggle-up-down {
  transition: transform .3s ease-in-out !important;
}

.toggle-up-down.rotate {
  transform: rotate(180deg);
}

:deep(.v-skeleton-loader__button) {
  max-width: unset !important;
  justify-self: end;
}

.legend-tooltip {
  display: flex;
  flex-direction: column;
  padding: 1em;

  :deep(.v-chip) {
    width: fit-content;
  }
}
</style>