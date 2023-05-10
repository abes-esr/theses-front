<template>
  <div class="key-words-tile-wrapper">
    <v-icon color="primary">mdi-view-list-outline</v-icon>
    <h1>Mots clés</h1>
<!--    language selector-->
  </div>
  <v-chip-group>
    <v-chip v-for="mot in keywordsFR" :key="mot">
      <span>{{ mot }}</span>
    </v-chip>
  </v-chip-group>
  <!--      <v-row>
                <h2>{{ $t('theseView.motcle') }}</h2>
            </v-row>
            <v-row>
                <v-list density="compact" v-if="selected === 'fr'" :items="keywordsFR"></v-list>
                <v-list density="compact" v-if="selected === 'en'" :items="keywordsEN"></v-list>
            </v-row>
                <v-row class="ma-0 pt-8">
                    <h4>{{ $t('theseView.resume') }}</h4>
                </v-row>
                <v-row class="ma-0 pb-6 pt-2">
                    <div v-for="(item, key) in these.resumes" :key="item">
                        <span @click="select(key)">
                            <h4 class="normalFont clickable px-2" :class="selected === key ? 'selected' : ''"> {{
                                key
                            }}</h4>
                        </span>
                    </div>
                </v-row>
                <v-row class="ma-0">
                    <span> {{ resume }}</span>
                </v-row> -->
</template>

<script setup>
import { onBeforeUpdate, ref } from "vue";

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

const keywordsFR = ref([]);
const keywordsEN = ref([]);

onBeforeUpdate(() => {
  setKeywords();
  console.log(keywordsFR.value)
  console.log(props.these)
});

function setKeywords() {
  keywordsFR.value = ( typeof props.these.sujetsFR === 'undefined' ) ? props.these.sujetsRameau : props.these.sujetsRameau.concat(props.these.sujetsFR);
  keywordsEN.value = props.these.sujetsEN;
}
</script>

<style scoped>
.key-words-tile-wrapper {
  display: inline-flex;
}
</style>