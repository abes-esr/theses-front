<template>
  <div>
    <div>
      <div class="key-words-title-wrapper">
        <div class="title">
          <v-icon color="primary">mdi-list-box</v-icon>
          <h2 id="keywords-title">{{ $t('motcle') }}</h2>
          <CommonLanguageSelector :languages="langList" @update-langue="onUpdateLangue"></CommonLanguageSelector>
        </div>
      </div>
      <div class="thesis-keywords" v-if="type === 'theses'">
        <div class="mots-cles-controlles" v-if="rameauKeywords.length > 0">
          <div  ref="backFromKeywordModal" aria-labelledby="mots-cles-controles-header" class="subtitle">
            <h3 id="mots-cles-controles-header">{{ $t("motCleControle") }}</h3>
            <v-btn class="info-button" @click="overlayIsOpened = !overlayIsOpened" flat :title="$t('infoKeywords')">
              <v-icon size="22">mdi-information-outline</v-icon>
              <span class="sr-only">{{ $t("infoKeywords") }}</span>
            </v-btn>
            <v-overlay v-model="overlayIsOpened" location-strategy="connected" scroll-strategy="close">
              <div tabindex="0" id="legend-tooltip">
                <v-card class="legend-tooltip">
                  <span>
                    {{ $t("motCleControleDescription") }} <a :title="$t('footer.idRef')" href="https://www.idref.fr/">idRef.</a>
                  </span>
                  <div class="close-overlay-button-container">
                    <v-btn @click="overlayIsOpened = !overlayIsOpened" class="close-overlay-button" variant="outlined" density="compact" append-icon="mdi-close-box" flat>{{ $t('access.fermer') }}</v-btn>
                  </div>
                </v-card>
              </div>
            </v-overlay>
          </div>
          <div role="list" aria-labelledby="mots-cles-controles-header" class="chip-lines v-chip-group" :class="isRtl ? 'rtl-text' : ''">
            <template v-for="keyWord in rameauKeywords" :key="keyWord.keyword + forceRenderKey" :title="keyWord.keyword">
              <nuxt-link role="listitem" @click="setIsAdvanced(false)"
                :to="{ name: 'resultats', query: { q: keyWord.query ? keyWord.query : keyWord.keyword, domaine: 'theses' } }">
                <v-chip label class="rameau-chip chips" tabindex="-1">
                  <span class="key-word-label" tabindex="-1">{{ keyWord.keyword }}</span>
                </v-chip>
              </nuxt-link>
            </template>
          </div>
        </div>
        <div id="mots-cles-libres" v-if="freeKeywords.length > 0">
          <div class="subtitle">
            <h3>{{ $t("motCleLibres") }}</h3>
          </div>
          <div role="list" aria-labelledby="mots-cles-libres" class="chip-lines v-chip-group" :class="isRtl ? 'rtl-text' : ''">
            <template v-for="keyWord in freeKeywords" :key="keyWord.keyword + forceRenderKey" :title="keyWord.keyword">
              <nuxt-link role="listitem" @click="setIsAdvanced(true)"
                :to="{ name: 'resultats', query: { q: keyWord.query ? createKeywordQuery(keyWord.query) : createKeywordQuery(keyWord.keyword), domaine: 'theses', avancee: 'true' } }">
                <v-chip label class="free-chip chips" tabindex="-1">
                  <span class="key-word-label">{{ keyWord.keyword }}</span>
                </v-chip>
              </nuxt-link>
            </template>
          </div>
        </div>
      </div>
      <div v-else>
        <div role="list" aria-labelledby="keywords-title" v-if="mixedKeywords.length > 0" class="chip-lines v-chip-group" :class="isRtl ? 'rtl-text' : ''">
          <template v-for="keyWord in mixedKeywords" :key="keyWord.keyword + forceRenderKey" :title="keyWord.keyword">
            <nuxt-link role="listitem" @click="setIsAdvanced(true)"
              :to="{ name: 'resultats', query: { q: keyWord.query ? keyWord.query : keyWord.keyword, domaine: 'theses', avancee: 'true' } }">
              <v-chip label class="chips" :class="keyWord.type === 'sujetsRameau' ? 'rameau-chip' : 'free-chip'"
                tabindex="-1">
                <span class="key-word-label">{{ keyWord.keyword }}</span>
              </v-chip>
            </nuxt-link>
          </template>
        </div>
        <div id="key-words-button-wrapper">
          <v-btn
            v-if="numberOfKeywords > numberOfKeywordsPerLine && keywords[selectedLanguage].length > numberOfKeywordsPerLine"
            class="read-more-less-button" variant="outlined" @click="narrowDownKeywords" flat>
            <span></span>
            <span>{{ $t('showLessKeywords') }}</span>
            <v-icon class="toggle-up-down rotate">mdi-arrow-down-circle-outline</v-icon>
          </v-btn>
          <v-btn v-if="numberOfKeywords < keywords[selectedLanguage].length" class="read-more-less-button"
            variant="outlined" @click="addNKeywords" flat>
            <span></span>
            <span>{{ $t('showMoreKeywords') }}</span>
            <v-icon class="toggle-up-down">mdi-arrow-down-circle-outline</v-icon>
          </v-btn>
          <v-btn v-if="numberOfKeywords < keywords[selectedLanguage].length" class="read-more-less-button"
            variant="outlined" @click="showAllKeywords" flat>
            <span></span>
            <span>{{ $t('showAllKeywords') + "(" + keywords[selectedLanguage].length + ")" }}</span>
            <v-icon class="toggle-up-down">mdi-arrow-down-circle-outline</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUpdate, ref, watch, computed } from "vue";
import { useDisplay } from "vuetify";
import { LanguesRTL } from "@/services/Common";

const props = defineProps({
  these: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    default: 'theses'
  }
});

const { mobile } = useDisplay();
const overlayIsOpened = ref(false);

// Si c'est une these (donc si on a un titre dans l'objet) on affiche plus de keywords
const numberOfKeywordsPerLine = mobile.value ? ref(6) : props.these.titrePrincipal ? ref(50) : ref(20);
const numberOfKeywords = mobile.value ? ref(6) : props.these.titrePrincipal ? ref(50) : ref(20);
const forceRenderKey = ref(0);

const keywords = ref([]);
const increment = props.these.titrePrincipal ? ref(10) : ref(20);
const selectedLanguage = ref("fr");
const freeKeywords = ref({});
const rameauKeywords = ref({});
const mixedKeywords = ref({});
const isAdvanced = useState('isAdvanced');

const backFromKeywordModal = ref(null);

setKeywords();

onBeforeUpdate(() => {
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
 * Renvoie un sous-ensemble du tableau de mot-clés selon la valeur de numberOfKeywords ou le type de mot clé désiré
 * @returns {UnwrapRefSimple<*>[]}
 */
function selectKeyWords(keyWordType = null) {
  if (typeof keyWordType === 'string')
    return keywords.value[selectedLanguage.value].filter((word) => { return word.type === keyWordType; });

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

  if (props.type === 'theses') {
    freeKeywords.value = selectKeyWords('sujet');
    rameauKeywords.value = selectKeyWords('sujetsRameau');
  } else {
    mixedKeywords.value = selectKeyWords();
  }
}

const isRtl = ref(false);

function onUpdateLangue(langue) {
  selectedLanguage.value = langue;
  isRtl.value = LanguesRTL.includes(selectedLanguage.value.toLowerCase());

  setKeywords();
}

function addNKeywords() {
  numberOfKeywords.value += increment.value;
  focusLastKeyword();
}

function narrowDownKeywords() {
  numberOfKeywords.value = numberOfKeywordsPerLine.value;
  focusLastKeyword();
}

function showAllKeywords() {
  numberOfKeywords.value = keywords.value[selectedLanguage.value].length;
  focusLastKeyword();
}

function createKeywordQuery(keyword) {
  return "(sujetsLibelle:(" + keyword + ") OU sujetsRameauLibelle:(" + keyword + "))";
}

function focusLastKeyword() {
  var chipGroup = document.querySelector('.v-chip-group');

  if (chipGroup) {
    var lastAElement = chipGroup.querySelector('a:last-child');

    if (lastAElement) {
      lastAElement.focus();
    }
  }
}

function setIsAdvanced(value) {
  isAdvanced.value = value;
}

onUpdated(() => {
  if(overlayIsOpened.value) {
    document.getElementById('legend-tooltip').focus();
  } else if (backFromKeywordModal.value !== null) {
    backFromKeywordModal.value.focus();
  }
});

/**
 * Watchers
 */
watch(mobile, (newValue) => {
  numberOfKeywordsPerLine.value = newValue ? 6 : props.these.titrePrincipal ? 50 : 10;
  numberOfKeywords.value = newValue ? 6 : props.these.titrePrincipal ? 50 : 10;
  forceRenderKey.value++;
});
</script>

<style scoped lang="scss">
@use '../../node_modules/vuetify/settings';

.chip-lines :deep(.v-chip--disabled) {
  opacity: unset;
  pointer-events: unset;
}

.chip-lines {
  flex-wrap: wrap !important;
}

.key-words-title-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 0.4em;
}

.title,
.subtitle {
  display: inline-flex;
  align-items: center;
}

.subtitle {
  height: 2em;
}

.thesis-keywords {
  margin-left: 1.5em;
}

h2 {
  font-size: 24px;
  margin-left: 5px;

  font-family: Roboto-Bold, sans-serif;
  font-weight: 700;
  letter-spacing: 0px;
  color: rgb(var(--v-theme-text-dark-blue))
}

h3 {
  font-size: 20px;

  font-family: Roboto-Bold, sans-serif;
  font-weight: 600;
  letter-spacing: 0px;
  color: rgb(var(--v-theme-text-dark-blue))
}

.info-button {
  min-width: unset;
  padding: 0 8px;
}

.mdi-list-box.v-icon--size-default {
  font-size: 30px;
  width: 35px;
}

.v-chip-group {
  padding: 0;
  padding-bottom: 0.5em;
  justify-content: flex-start;
  flex-wrap: nowrap;
  max-width: 90vw;

  margin-top: unset !important;

  .free-chip {
    background-color: rgb(var(--v-theme-secondary-darken-3)) !important;
  }

  .rameau-chip {
    background-color: rgb(var(--v-theme-orange-abes-thesaurus)) !important;
    color: rgb(var(--v-theme-thesaurus-text));
  }

  .chips {
    cursor: pointer;
  }
}

#second-chip-line {
  flex-wrap: wrap !important;
}

.v-chip {
  :deep(.v-chip__content) {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    max-width: 90vw;
  }
}

.v-chip--label {
  font-family: Roboto Black, sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: rgb(var(--v-theme-white-text));
}

.v-chip--disabled {
  background-color: rgb(var(--v-theme-gris-clair));
}

.key-word-label {
  width: 100%;
  padding: 0 5px;

  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;

  white-space: break-spaces;
  word-break: break-word;
}


#key-words-button-wrapper {
  display: flex;
  justify-content: flex-end;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    flex-direction: column;
    align-items: end;
    max-width: 90vw;
  }
}

.read-more-less-button {
  margin: 1em 1em 0 0;
  text-transform: none;
  display: inline-flex;
  padding: 0 1em;
  letter-spacing: 0.5px;
  max-width: 90%;

  :deep(.v-btn__content) {
    width: 100%;
    justify-content: space-between;

    i {
      margin-left: 0.3em;
    }

    span {
      overflow: hidden;
      text-overflow: ellipsis;
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

:deep(.v-overlay__content) {
  width: 98%;
  top: 50%;
  transform: translateY(-50%);
  left: 50%;
  transform: translateX(-50%);
}

.legend-tooltip {
  display: flex;
  flex-direction: column;
  padding: 1em;

  :deep(.v-chip) {
    width: fit-content;
  }

  .close-overlay-button-container {
    display: flex;
    justify-content: center;
  }

  .close-overlay-button {
    margin-top: 1em;
    width: fit-content;
    color: rgb(var(--v-theme-text-dark-blue));
    text-transform: capitalize;
  }
}

:deep(.v-chip__underlay) {
  opacity: 0 !important;
}

:deep(.v-chip.v-chip--density-default) {
  height: unset !important;
  min-height: 32px !important;
}
</style>