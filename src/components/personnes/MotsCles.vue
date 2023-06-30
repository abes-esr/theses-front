<template>
  <div class="key-words-title-wrapper">
    <v-icon color="primary">mdi-list-box</v-icon>
    <h1>{{ $t('theseView.motcle') }}</h1>
    <template v-for="[lang] in Object.entries(motsCles).sort((a,b) => a[0]=='fr' || b[0]=='fr')" :key="lang">
      <v-btn @click="changeLanguage(lang)" flat text>
        <span :class='{ "selectedLang": selectedLang == lang }'>{{ lang }}</span>
      </v-btn>
      <v-divider vertical></v-divider>
    </template>
  </div>
  <v-chip-group id="first-chip-line">
    <v-chip label v-for="item in selections" :key="item">
      <span class="key-word-label">{{ item }}</span>
    </v-chip>
  </v-chip-group>
  <div id="key-words-button-wrapper">
    <v-btn id="read-more-button" @click="readMore = !readMore" flat>
      <span></span>
      <span>{{
          readMore ? $t('personnes.personneView.motsCles.readLess') : $t('personnes.personneView.motsCles.readMore')
        }}</span>
      <v-icon class="toggle-up-down" :class='{ "rotate": readMore }'>mdi-arrow-down-circle-outline</v-icon>
    </v-btn>
  </div>
</template>
<script>
export default {
  name: "personne-motcles"
};
</script>
<script setup>
import {computed, ref} from "vue";

const props = defineProps({
  motsCles: {
    type: Object,
    required: true
  },
});

const selectedLang = ref("fr");
const readMore = ref(false);

const selections = computed(() => readMore.value ? props.motsCles[selectedLang.value] : props.motsCles[selectedLang.value].slice(0, 10));

function changeLanguage(lang) {
  selectedLang.value = lang;
}
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

#first-chip-line :deep(.v-chip--disabled) {
  opacity: unset;
  pointer-events: unset;
}

.key-words-title-wrapper {
  display: flex;
  align-items: center;
  margin-left: 5px;
  flex: 1 1 100%;
  width: 100%;

  .v-btn {
    background-color: transparent !important;
    font-size: 18px;
    font-weight: 700;

    .selectedLang {
      color: rgb(var(--v-theme-orange-abes));
    }
  }

  hr {
    height: 20px;
    margin-top: 8px;
    border-color: rgb(var(--v-theme-primary));
    opacity: 1;
    border-width: 0 2px 0 0;
  }

  hr:last-of-type {
    display: none;
  }

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

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    justify-content: space-around;
  }
}

.v-chip {
  flex: 0 1 20%;
  background-color: rgb(var(--v-theme-fond-chip-blue));
  justify-content: center;
  width: 19%;
  pointer-events: none;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    flex: 0 1 40%;
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