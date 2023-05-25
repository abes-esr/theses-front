<template>
  <div>
    <div class="key-words-tile-wrapper">
      <v-icon color="primary">mdi-view-list-outline</v-icon>
      <h1>{{ $t('theseView.motcle') }}</h1>
  <!--    language selector-->
    </div>
    <v-chip-group id="first-chip-line">
      <v-chip label v-for="keyWord in selectKeyWords(keyWordPerLine, 0)" :key="keyWord.keyword+forceRenderKey" :title="keyWord.keyword">
        <span class="key-word-label">{{ keyWord.keyword }}</span>
      </v-chip>
    </v-chip-group>
    <v-chip-group id="second-chip-line">
  <!--      readmore button effect-->
        <v-chip v-show="readMore" label v-for="keyWord in selectKeyWords(Infinity, keyWordPerLine)" :key="keyWord.keyword+forceRenderKey" :title="keyWord.keyword">
          <span class="key-word-label">{{ keyWord.keyword }}</span>
        </v-chip>
      </v-chip-group>
    <div id="key-words-button-wrapper" v-if="selectKeyWords(Infinity, keyWordPerLine).length > 0">
      <v-btn id="read-more-button" @click="readMore = !readMore" flat>
        <span></span>
        <span>{{ readMore ? 'Moins' : 'Lire la suite' }}</span>
        <v-icon class="toggle-up-down" :class='{ "rotate": readMore }'>mdi-arrow-down-circle-outline</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, onBeforeUpdate, ref, watch } from "vue";
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
  let sujetsFR = [];
  let sujetsRameau = [];

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
          'keyword': keyWord,
          'type': 'sujetsRameau'
        }
      )
    });
  }

  keywordsFR.value = ( typeof props.these.sujetsFR === 'undefined' ) ? sujetsRameau : sujetsRameau.concat(sujetsFR);
  keywordsEN.value = props.these.sujetsEN;
  console.info(keywordsFR.value)
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

  .key-words-tile-wrapper {
    display: inline-flex;
    align-items: center;
    margin-left: 10px;
  }

  h1 {
    font-size: 24px;
    margin-left: 5px;

    font-family: Roboto-Bold, sans-serif;
    font-weight: 700;
    letter-spacing: 0px;
    color: rgb(var(--v-theme-text-dark-blue))
  }

  .mdi-view-list-outline.v-icon--size-default {
    font-size: 35px;
    width: 30px;
  }

  .v-chip-group {
    padding: 0 0;
    justify-content: start;
    flex-wrap: nowrap;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
      flex-wrap: wrap;
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
      width: 48%;
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
    width: 130px;
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