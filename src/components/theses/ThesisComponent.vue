<template>
  <div v-if="dataReady">
    <thesis-toolbar />
    <thesis-table :these="these" />
    <v-divider />
<!--    <thesis-keywords />-->
<!--    <v-divider />-->
    <scroll-to-top-button v-show="hasScrolled" class="scroll-to-top-wrapper" :nb-result=1 />
</div>
</template>

<script setup>
import ScrollToTopButton from "@/components/common/ScrollToTopButton.vue";
import ThesisToolbar from "@/components/theses/ThesisToolbar.vue";
import ThesisTable from "@/components/theses/ThesisTable.vue";
import ThesisKeywords from "@/components/theses/ThesisKeywords.vue";
import { useDisplay } from "vuetify";
import { watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useMeta } from "vue-meta";

const { mobile } = useDisplay();
const { t } = useI18n();
const { meta } = useMeta({});

const props = defineProps({
  dataReady: {
    type: Boolean,
    default: false
  },
  these: {
    type: Object
  }
});

watchEffect(() => {
  const titleThese = props.these.titrePrincipal ? props.these.titrePrincipal : "";
  meta.title = titleThese;
  meta.description = t("meta.descThese") + titleThese;
});


</script>

