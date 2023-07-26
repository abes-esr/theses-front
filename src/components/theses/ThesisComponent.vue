<template>
  <thesis-toolbar :source="these.source" :nnt="props.nnt"
    :etab-ppn="these.etabSoutenance ? these.etabSoutenance.ppn : ''" />
  <div>
    <thesis-title :data-ready="dataReady" :status="these.status" :titles="these.titres" id="top-of-thesis-component" />
    <thesis-table class="thesis-component" :these="these" />
    <v-divider v-if="keywordsAreSet" :thickness="1" class="divider border-opacity-50" length="90%" />
    <thesis-keywords class="thesis-component" :keywords-are-set="keywordsAreSet" :data-ready="dataReady" :these="these"
      :selected-language="selectedLanguage" @changeLanguage="changeLanguage" />
    <v-divider v-if="resumeIsSet" :thickness="1" class="divider border-opacity-50" length="90%" />
    <thesis-resume class="thesis-component" :resume-is-set="resumeIsSet" :data-ready="dataReady" :these="these"
      :selected-language="selectedLanguage" />
    <div class="scroll-to-top-container">
      <scroll-to-top-button class="scroll-to-top-wrapper" :nb-result=1 />
    </div>
  </div>
  <div v-if="!titleIsSet">
    <v-skeleton-loader type="heading"></v-skeleton-loader>
    <v-skeleton-loader type="paragraph"></v-skeleton-loader>
    <v-skeleton-loader type="paragraph"></v-skeleton-loader>
    <v-divider :thickness="1" class="divider border-opacity-50" length="90%" />
    <v-skeleton-loader type="subtitle"></v-skeleton-loader>
    <v-skeleton-loader type="chip, chip, chip, chip, chip, chip"></v-skeleton-loader>
    <v-divider :thickness="1" class="divider border-opacity-50" length="90%" />
    <v-skeleton-loader type="heading"></v-skeleton-loader>
    <v-skeleton-loader type="paragraph"></v-skeleton-loader>
    <v-skeleton-loader type="paragraph"></v-skeleton-loader>
    <v-skeleton-loader type="paragraph"></v-skeleton-loader>
  </div>
</template>

<script setup>
import ScrollToTopButton from "@/components/common/ScrollToTopButton.vue";
import ThesisToolbar from "@/components/theses/ThesisToolbar.vue";
import ThesisTable from "@/components/theses/ThesisTable.vue";
import ThesisKeywords from "@/components/common/Keywords.vue";
import { onBeforeUpdate, ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useMeta } from "vue-meta";
import ThesisTitle from "@/components/theses/ThesisTitle.vue";
import ThesisResume from "@/components/theses/ThesisResume.vue";

const { t } = useI18n();
const { meta } = useMeta({});
const selectedLanguage = ref('fr');


const props = defineProps({
  dataReady: {
    type: Boolean,
    default: false
  },
  these: {
    type: Object
  },
  nnt: {
    type: String
  }
});

const resumeIsSet = ref(false);
const titleIsSet = ref(false);
const keywordsAreSet = ref(false);

onBeforeUpdate(() => {
  keywordsAreSet.value = (typeof props.these.mapSujets !== 'undefined' && props.these.mapSujets.fr.length > 0)
  resumeIsSet.value = typeof props.these.resumes !== 'undefined' && Object.entries(props.these.resumes).length > 0;
  titleIsSet.value = typeof props.these.titrePrincipal !== 'undefined' && Object.entries(props.these.titrePrincipal).length > 0;
});

function changeLanguage(newValue) {
  selectedLanguage.value = newValue;
}

watchEffect(() => {
  const titleThese = props.these.titrePrincipal ? props.these.titrePrincipal : "";
  meta.title = titleThese;
  meta.description = t("meta.descThese") + titleThese;
});


</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.thesis-component {
  width: 92%;
  margin: 0 auto 20px;
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

#top-of-thesis-component {
  hyphens: auto;
}
</style>