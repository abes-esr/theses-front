<template>
  <div v-if="dataReady && these !== {}">
    <thesis-toolbar />
    <thesis-title :data-ready="dataReady" :status="these.status" :titles="these.titres" />
    <thesis-table class="thesis-component" :these="these" />
    <v-divider :thickness="2" class="divider border-opacity-50" length="90%" />
    <thesis-keywords class="thesis-component" :data-ready="dataReady" :these="these" :selected-language="selectedLanguage" @changeLanguage="changeLanguage" />
    <v-divider :thickness="2" class="divider border-opacity-50" length="90%" />
    <thesis-resume class="thesis-component" :data-ready="dataReady" :these="these" :selected-language="selectedLanguage" />
    <scroll-to-top-button v-show="hasScrolled" class="scroll-to-top-wrapper" :nb-result=1 />
</div>
</template>

<script setup>
import ScrollToTopButton from "@/components/common/ScrollToTopButton.vue";
import ThesisToolbar from "@/components/theses/ThesisToolbar.vue";
import ThesisTable from "@/components/theses/ThesisTable.vue";
import ThesisKeywords from "@/components/theses/ThesisKeywords.vue";
import { useDisplay } from "vuetify";
import { ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useMeta } from "vue-meta";
import ThesisTitle from "@/components/theses/ThesisTitle.vue";
import ThesisResume from "@/components/theses/ThesisResume.vue";

const { mobile } = useDisplay();
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
  .thesis-component {
    width: 92%;
    margin: 0 auto 20px;
  }

  .divider {
    margin: 10px auto 15px;
  }
</style>