<template>
  <div v-if="keywordsAreSet">
    <div class="key-words-title-wrapper">
      <v-icon color="primary">mdi-list-box</v-icon>
      <h1>{{ $t('theseView.motcle') }}</h1>
  <!--    language selector-->
    </div>
    <v-chip-group id="first-chip-line">
      <v-chip label v-for="keyWord in selectKeyWords(keyWordPerLine, 0)"
              :key="keyWord.keyword+forceRenderKey" :title="keyWord.keyword"
              :disabled="keyWord.type === 'sujetsRameau' ? false : true"
              @click="$router.push({ name: 'resultats', query: { sujetRameau: keyWord.keyword, q: keyWord.query ? keyWord.query : keyWord.keyword } });"
      >
        <span class="key-word-label">{{ keyWord.keyword }}</span>
      </v-chip>
    </v-chip-group>
    <v-chip-group id="second-chip-line">
  <!--      readmore button effect-->
        <v-chip v-show="readMore" label v-for="keyWord in selectKeyWords(Infinity, keyWordPerLine)"
                :key="keyWord.keyword+forceRenderKey" :title="keyWord.keyword"
                :disabled="keyWord.type === 'sujetsRameau' ? false : true"

        >
          <span class="key-word-label">{{ keyWord.keyword }}</span>
        </v-chip>
      </v-chip-group>
    <div id="key-words-button-wrapper" v-if="selectKeyWords(Infinity, keyWordPerLine).length > 0">
      <v-btn id="read-more-button" @click="readMore = !readMore" flat>
        <span></span>
        <span>{{ readMore ? $t('theseView.showLessKeywords') : $t('theseView.showMoreKeywords') }}</span>
        <v-icon class="toggle-up-down" :class='{ "rotate": readMore }'>mdi-arrow-down-circle-outline</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUpdate, ref, watch } from "vue";
import { useDisplay } from "vuetify";

const props = defineProps({
  these: {
    type: Object,
    required: true
  },
  selectedLanguage: {
    type: String
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

const keywordsFR = ref([]);
const keywordsEN = ref([]);
const readMore = ref(false);

onBeforeUpdate(() => {
  setKeywords();
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
  return keywordsFR.value.filter((word, index) => { return index < numberOfWords+offset && index >= offset });
}

function setKeywords() {
  const sujetsFR = [];
  const sujetsRameau = [];

  if( typeof props.these.sujetsFR !== 'undefined' ) {
    props.these.sujetsFR.forEach((keyWord) => {
      sujetsFR.push(
        { 'keyword': keyWord,
          'type': 'sujetsFR'
        }
      )
    });
  }

  if( typeof props.these.sujetsRameau !== 'undefined' ) {
    props.these.sujetsRameau.forEach((keyWord) => {
      sujetsRameau.push(
        {
          'keyword': keyWord.libelle,
          'query': `"${keyWord.libelle}" ET "${keyWord.ppn}"`,
          'type': 'sujetsRameau'
        }
      )
    });
  }

  keywordsFR.value = ( typeof props.these.sujetsFR === 'undefined' ) ? sujetsRameau : sujetsRameau.concat(sujetsFR);
  keywordsEN.value = props.these.sujetsEN;
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
@use 'vuetify/settings';

  #second-chip-line :deep(.v-chip--disabled), #first-chip-line :deep(.v-chip--disabled) {
    opacity: unset;
    pointer-events: unset;
  }

  .key-words-title-wrapper {
    display: inline-flex;
    align-items: center;
    margin-left: 5px;
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
    margin: 0 10px;
    padding: 0;
    justify-content: start;
    flex-wrap: nowrap;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }

  #second-chip-line {
    flex-wrap: wrap !important;
  }

  .v-chip {
    background-color: rgb(var(--v-theme-fond-chip-blue));
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
    color: rgb(var(--v-theme-primary));
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
    background-color: rgb(var(--v-theme-primary));
    text-transform: none;
    color: white;
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