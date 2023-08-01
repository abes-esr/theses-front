<template>
  <div v-if="keywordsAreSet">
    <div class="key-words-title-wrapper">
      <v-icon color="primary">mdi-list-box</v-icon>
      <h1>{{ $t('theseView.motcle') }}</h1>
      <language-selector :languages="langList" @update-langue="onUpdateLangue"></language-selector>
    </div>
    <v-chip-group id="first-chip-line">
      <v-chip label v-for="keyWord in selectKeyWords(keyWordPerLine, 0)" :key="keyWord.keyword + forceRenderKey"
        :title="keyWord.keyword" :class="keyWord.type === 'sujetsRameau' ? 'rameau-chip' : 'free-chip'"
        :disabled="keyWord.type === 'sujetsRameau' ? false : true"
        @click="if (keyWord.type === 'sujetsRameau') $router.push({ name: 'resultats', query: { q: keyWord.query ? keyWord.query : keyWord.keyword, domaine: 'theses' } });">
        <span class="key-word-label">{{ keyWord.keyword }}</span>
      </v-chip>
    </v-chip-group>
    <v-chip-group id="second-chip-line">
      <!--      readmore button effect-->
      <v-chip v-show="readMore" label v-for="keyWord in selectKeyWords(Infinity, keyWordPerLine)"
        :key="keyWord.keyword + forceRenderKey" :title="keyWord.keyword"
        :class="keyWord.type === 'sujetsRameau' ? 'rameau-chip' : 'free-chip'"
        :disabled="keyWord.type === 'sujetsRameau' ? false : true"
        @click="if(keyWord.type === 'sujetsRameau') $router.push({ name: 'resultats', query: { q: keyWord.query ? keyWord.query : keyWord.keyword, domaine: 'theses' } });">
        <span class="key-word-label">{{ keyWord.keyword }}</span>
      </v-chip>
    </v-chip-group>
    <div id="key-words-button-wrapper" v-if="selectKeyWords(Infinity, keyWordPerLine).length > 0">
      <v-btn id="read-more-button" variant="outlined" @click="readMore = !readMore" flat>
        <span></span>
        <span>{{ readMore ? $t('theseView.showLessKeywords') : $t('theseView.showMoreKeywords') }}</span>
        <v-icon class="toggle-up-down" :class='{ "rotate": readMore }'>mdi-arrow-down-circle-outline</v-icon>
      </v-btn>
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

const keyWordPerLine = mobile.value ? ref(6) : ref(5);
const forceRenderKey = ref(0);

const keywords = ref([]);
const readMore = ref(false);
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
function selectKeyWords(numberOfWords, offset) {
  return keywords.value[selectedLanguage.value].filter((word, index) => { return index < numberOfWords + offset && index >= offset; });
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

/**
 * Watchers
 */
watch(mobile, (newValue) => {
  keyWordPerLine.value = newValue ? 6 : 5;

  forceRenderKey.value++;
});
</script>

<style scoped lang="scss">
@use '../../../node_modules/vuetify/settings';

#second-chip-line :deep(.v-chip--disabled),
#first-chip-line :deep(.v-chip--disabled) {
  opacity: unset;
  pointer-events: unset;
}

.key-words-title-wrapper {
  display: inline-flex;
  align-items: center;
  margin: 0.4em 0 0.8em 0;
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
    background-color: rgb(var(--v-theme-secondary-darken-2));
  }

  .rameau-chip {
    background-color: rgb(var(--v-theme-orange-abes));
  }
}

#second-chip-line {
  flex-wrap: wrap !important;
}

.v-chip {
  justify-content: center;
  width: 19%;

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

#read-more-button {
  margin-top: 7px;
  text-transform: none;
  width: 220px;
  display: inline-flex;
  padding: 0 7px;
  letter-spacing: 0px;

  :deep(.v-btn__content) {
    width: 100%;
    justify-content: space-between;
  }
}

.toggle-up-down {
  transition: transform .3s ease-in-out !important;
}

.toggle-up-down.rotate {
  transform: rotate(180deg);
}
</style>