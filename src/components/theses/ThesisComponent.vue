<template>
  <div v-if="dataReady && these !== {}">
    <thesis-toolbar />
    <thesis-title :data-ready="dataReady" :status="these.status" :titles="these.titres" />
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
</template>

<script setup>
import ScrollToTopButton from "@/components/common/ScrollToTopButton.vue";
import ThesisToolbar from "@/components/theses/ThesisToolbar.vue";
import ThesisTable from "@/components/theses/ThesisTable.vue";
import ThesisKeywords from "@/components/theses/ThesisKeywords.vue";
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
  }
});

const resumeIsSet = ref(false);
const keywordsAreSet = ref(false);

onBeforeUpdate(() => {
  keywordsAreSet.value = (typeof props.these.sujetsRameau !== 'undefined' && props.these.sujetsRameau.length > 0)
    || (typeof props.these.sujets !== 'undefined' &&  Object.entries(props.these.sujets).length > 0 );
  resumeIsSet.value = typeof props.these.resumes !== 'undefined' && Object.entries(props.these.resumes).length > 0;
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

  .divider {
    margin: 10px auto 15px;
  }

  .scroll-to-top-container {
    position: absolute;
    left: 95%;
    top: 30%;
    width: 5%;
    bottom: 300px;
  }

  .scroll-to-top-wrapper {
    margin-left: 25px;
    margin-bottom: 0;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
        //margin: 0 0;
        //height: 60px;
        //left: 90vw;
        //top: unset;
        //bottom: 5vh;
      }
    }
</style>