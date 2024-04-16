<template>
  <v-menu location="bottom">
    <template v-slot:activator="{ props }">
      <v-btn class="main-btn" icon="mdi-upload-box" color="secondary-darken-2" variant="text"
        title="Exporter les données" v-bind="props">
      </v-btn>
    </template>
    <v-list role="list">
      <v-list-item v-for="(exportType, index) in exportTypeList" :key="index" role="listitem">
        <v-list-item-title class="export-titles">{{ $t(index) }}</v-list-item-title>
        <v-list-item-subtitle v-for="file in exportType" class="export-buttons">
          <v-btn color="secondary-darken-3" density="compact" :href="file.url" target="_blank">
            {{ file.title }}
          </v-btn>
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-menu>
  <v-btn class="main-btn" icon="mdi-rss-box" color="secondary-darken-2" variant="text" title="Flux RSS" :href="rssHref"
    target="_blank">
  </v-btn>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  jsonHref: {
    type: String,
    default: ""
  },
  rssHref: {
    type: String,
    default: ""
  },
  csvHref: {
    type: String,
    default: ""
  }
});

const exportTypeList = ref({});
exportTypeList.value = {
  exportData: {
    JSON: {
      title: 'JSON',
      url: props.jsonHref
    },
    CSV: {
      title: 'CSV',
      url: props.csvHref
    }
  }
}

</script>

<style scoped lang="scss">
@use 'vuetify/settings';


.v-btn {
  text-transform: none;
  display: inline-flex;
  padding: 0 0.5em;
  letter-spacing: 0.5px;
  max-width: 90%;
  font-weight: 500;

  :deep(.v-icon) {
    --v-icon-size-multiplier: 1.3;
  }
}

.main-btn {
  margin-top: -3px;
}

.export-titles {
  font-size: 20px;
  font-weight: 500;
  font-family: Roboto-Regular, sans-serif;
  color: rgb(var(--v-theme-text-dark-blue));
  margin-bottom: 0.3em;
}

.export-buttons {
  display: inline-flex;
  opacity: 1 !important;

  :deep(.v-btn) {
    color: rgb(var(--v-theme-text-dark-blue));
    margin-right: 0.5em;
  }
}

:deep(.v-list) {
  border: solid 1px rgb(var(--v-theme-gris-clair));
}
</style>