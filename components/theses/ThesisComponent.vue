<template>
  <div>
    <ThesesThesisToolbar :source="these.source" :nnt="props.nnt"
      :etab-ppn="these.etabSoutenance ? these.etabSoutenance.ppn : ''" />
    <div class="thesis-info-access-wrapper">
      <ThesesThesisTitle :status="these.status" :titles="these.titres" />
      <!-- Bare latérale Desktop -->
      <div v-if="!mobile && soutenue" class="access-buttons">
        <!-- Menu boutons-liens desktop-->
        <ThesesButtonsList v-if="!mobile" :categories="categories" :soutenue="soutenue">
        </ThesesButtonsList>
      </div>

      <div class="thesis-info-wrapper">
        <ThesesThesisTable class="thesis-component" :these="these" />
        <v-divider v-if="keywordsAreSet" :thickness="1" class="divider border-opacity-50" length="90%" />
        <CommonKeywords v-if="keywordsAreSet" class="thesis-component" :keywords-are-set="keywordsAreSet" :these="these"
          :selected-language="selectedLanguage" @changeLanguage="changeLanguage" />
        <v-divider v-if="resumeIsSet" :thickness="1" class="divider border-opacity-50" length="90%" />
        <ThesesThesisResume v-if="resumeIsSet" class="thesis-component" :resume-is-set="resumeIsSet" :these="these"
          :selected-language="selectedLanguage" />
      </div>
      <ClientOnly>
        <div class="scroll-to-top-container">
          <LazyCommonScrollToTopButton class="scroll-to-top-wrapper" :nb-result=1 />
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, onBeforeUpdate } from "vue";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const { t } = useI18n();
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
  categories: {
    type: Object,
    default: []
  }
});

const resumeIsSet = ref(false);
const keywordsAreSet = ref(false);
checkIfSet();

onBeforeUpdate(() => {
  checkIfSet();
});

function checkIfSet() {
  keywordsAreSet.value = (typeof props.these.mapSujets !== 'undefined' && typeof props.these.mapSujets.fr !== 'undefined' && props.these.mapSujets.fr.length > 0)
  resumeIsSet.value = typeof props.these.resumes !== 'undefined' && Object.entries(props.these.resumes).length > 0;
}


function changeLanguage(newValue) {
  selectedLanguage.value = newValue;
}

watchEffect(() => {
  const titleThese = props.these.titrePrincipal ? props.these.titrePrincipal : "";

  // Titre détaillé 
  useSeoMeta({
    title: () => `${titleThese} | Theses.fr`,
    ogTitle: () => `${titleThese} | Theses.fr`,
    description: () => props.these.resumes.fr,
    ogDescription: () => props.these.resumes.fr,
    ogImage: "https://beta.theses.fr/logo-theses-beta.png",
    ogImageAlt: 'Logo Theses.fr',
    twitterCard: 'summary',
    ogType: 'website',
    author: () => props.these.auteurs[0].prenom + " " + props.these.auteurs[0].nom,
    creator: () => props.these.auteurs[0].prenom + " " + props.these.auteurs[0].nom
  });

  let listeSujetsFR = "";
  if (typeof props.these.mapSujets.fr !== 'undefined') {
    props.these.mapSujets.fr.forEach(element => {
      listeSujetsFR += element.keyword + ", ";
    });
  }

  useHead({
    meta: [
      { name: 'DC.type', content: 'thesis' },
      { name: 'citation_dissertation_name', content: 'thesis' },
      { name: 'DC.title', content: `${titleThese} | Theses.fr` },
      { name: 'citation_title', content: `${titleThese} | Theses.fr` },
      { name: 'DC.description.abstract', content: props.these.resumes.fr },
      { name: 'citation_abstract', content: props.these.resumes.fr },
      { name: 'DC.subject', content: listeSujetsFR },
      { name: 'citation_keywords', content: listeSujetsFR },
      { name: 'DC.creator', content: props.these.auteurs[0].prenom + " " + props.these.auteurs[0].nom },
      { name: 'citation_author', content: props.these.auteurs[0].prenom + " " + props.these.auteurs[0].nom },
      { name: 'DC.contributor', content: props.these.directeurs[0].prenom + " " + props.these.directeurs[0].nom },
      { name: 'DC.publisher', content: props.these.etabSoutenance.nom },
      { name: 'citation_dissertation_institution', content: props.these.etabSoutenance.nom },
      { name: 'DC.date', content: props.these.dateSoutenance },
      { name: 'citation_publication_date', content: props.these.dateSoutenance }
    ]
  });
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
  grid-column-end: 2;
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