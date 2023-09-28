<template>
  <ThesesThesisToolbar :source="these.source" :nnt="props.nnt"
    :etab-ppn="these.etabSoutenance ? these.etabSoutenance.ppn : ''" />
  <div class="thesis-info-access-wrapper">
    <ThesesThesisTitle class="thesis-title" :data-ready="dataReady" :status="these.status" :titles="these.titres" />
    <!-- Bare latérale Desktop -->
    <div v-if="!mobile && soutenue" class="access-buttons">
      <!-- Menu boutons-liens desktop-->
      <ThesesButtonsList v-if="!mobile" :data-ready="dataReady" :buttons-list="buttonsList" :soutenue="soutenue">
      </ThesesButtonsList>
    </div>
    <div class="thesis-info-wrapper">
      <ThesesThesisTable class="thesis-component" :these="these" :data-ready="dataReady" />
      <v-divider v-if="keywordsAreSet" :thickness="1" class="divider border-opacity-50" length="90%" />
      <CommonKeywords class="thesis-component" :keywords-are-set="keywordsAreSet" :data-ready="dataReady" :these="these"
        :selected-language="selectedLanguage" @changeLanguage="changeLanguage" />
      <v-divider v-if="resumeIsSet" :thickness="1" class="divider border-opacity-50" length="90%" />
      <ThesesThesisResume class="thesis-component" :resume-is-set="resumeIsSet" :data-ready="dataReady" :these="these"
        :selected-language="selectedLanguage" />
    </div>
    <div class="scroll-to-top-container">
      <CommonScrollToTopButton class="scroll-to-top-wrapper" :nb-result=1 />
    </div>
  </div>
</template>

<script setup>
import { onBeforeUpdate, ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const { t } = useI18n();
//const { meta } = useMeta({});
const selectedLanguage = ref('fr');

const props = defineProps({
  these: {
    type: Object
  },
  nnt: {
    type: String
  },
  soutenue: {
    type: Boolean
  },
  dataReady: {
    type: Boolean,
    default: false
  },
  buttonsList: {
    type: Object,
  }
});

const resumeIsSet = ref(false);
const titleIsSet = ref(false);
const keywordsAreSet = ref(false);

onBeforeUpdate(() => {
  keywordsAreSet.value = (typeof props.these.mapSujets !== 'undefined' && typeof props.these.mapSujets.fr !== 'undefined' && props.these.mapSujets.fr.length > 0)
  resumeIsSet.value = typeof props.these.resumes !== 'undefined' && Object.entries(props.these.resumes).length > 0;
  titleIsSet.value = typeof props.these.titrePrincipal !== 'undefined' && Object.entries(props.these.titrePrincipal).length > 0;
});

function changeLanguage(newValue) {
  selectedLanguage.value = newValue;
}

watchEffect(() => {
  const titleThese = props.these.titrePrincipal ? props.these.titrePrincipal : "";

  // Titre détaillé 
  useHead({
    meta: [{ property: 'title', content: `${titleThese} | Theses.fr` }, { property: 'description', content: t("meta.descThese") + titleThese }],
    title: `${titleThese} | Theses.fr `
  })
});
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.thesis-info-access-wrapper {
  display: grid;
  grid-template-rows: 1fr auto;
  grid-template-columns: 25fr 2fr 75fr;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    display: flex;
    flex-direction: column;
  }
}

.thesis-title {
  hyphens: auto;
  grid-column-start: 1;
  grid-column-end: 4;
  grid-row-start: 1;
}

.access-buttons {
  grid-column-start: 1;
  grid-row-start: 2;

}

.thesis-info-wrapper {
  grid-column-start: 3;
  grid-row-start: 2;
}

.thesis-component {
  width: 92%;
  margin: 2em auto;
}

.v-skeleton-loader {
  width: 92%;
  margin: 0 auto 20px;
  background-color: transparent !important;
}

:deep(.v-skeleton-loader__chip) {
  max-width: 200px;
}

.divider {
  margin: 10px auto 15px;
}

.scroll-to-top-container {
  position: absolute;
  left: 95.5%;
  top: 30%;
  width: 5%;
  bottom: 300px;

  @media #{ map-get(settings.$display-breakpoints, 'xl-and-up')} {
    left: 96%;
  }

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    left: 95%;
    bottom: 730px;
  }

  @media #{ map-get(settings.$display-breakpoints, 'xs')} {
    left: 90%;
    bottom: 800px;
  }
}

.scroll-to-top-wrapper {
  margin-left: 25px;
  margin-bottom: 0;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    margin: 0 0;
    height: 60px;
    top: 90vh !important;
  }
}
</style>