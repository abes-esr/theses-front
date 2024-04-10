<template>
  <v-menu location="bottom">
    <template v-slot:activator="{ props }">
      <v-btn flat append-icon="mdi-upload-box" variant="outlined" v-bind="props">
        <p>{{ $t("theseView.exporter") }}</p>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(exportType, index) in exportTypeList"
        :key="index"
      >
        <v-list-item-title class="export-titles">{{ $t(index) }}</v-list-item-title>
        <v-list-item-subtitle v-for="file in exportType" class="export-buttons">
            <v-btn color="secondary-darken-3" density="compact" :href="file.url">
              {{ file.title }}
            </v-btn>
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  nnt: {
    type: String,
    default: ""
  }
});

const exportTypeList = ref({});
exportTypeList.value = {
  exportData: {
    XML: {
      title: 'XML',
      url: '/api/v1/export/xml/' + props.nnt
    },
    RDF: {
      title: 'RDF',
      url: '/api/v1/export/rdf/' + props.nnt
    }
  },
  exportBiblio: {
    RIS: {
      title: 'RIS',
      url: '/api/v1/export/ris/' + props.nnt
    },
    BIB: {
      title: 'BIBTEX',
      url: '/api/v1/export/bib/' + props.nnt
    }
  }
}

</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.v-btn {
  text-transform: none;
  display: inline-flex;
  padding: 0 1em;
  letter-spacing: 0.5px;
  max-width: 90%;
  font-weight: 500;

  :deep(.mdi-upload-box) {
    color: rgb(var(--v-theme-secondary-darken-2));
  }
  :deep(.mdi-file-export-outline) {
    color: rgb(var(--v-theme-dark-blue));
  }
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