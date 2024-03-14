<template>
  <ClientOnly>
    <MessageBox ref="messageBox"></MessageBox>
  </ClientOnly>

  <ClientOnly>
    <div v-if="!mobile" class="thesis-toolbar no-wrap-text">
      <v-btn v-if="isBackAvailable" flat prepend-icon="mdi-arrow-left-circle-outline" variant="outlined"
        @click="previousPage">
        <template v-slot:prepend-icon>
          <v-icon>
            mdi-arrow-left-circle
          </v-icon>
        </template>
        <p>{{ $t("theseView.retour") }}</p>
      </v-btn>
      <span v-else></span>
      <div class="no-wrap-text">
<!--        Export-->
        <v-menu location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn flat append-icon="mdi-file-export-outline" variant="outlined" v-bind="props">
              <template v-slot:append-icon>
                <v-icon>
                  mdi-file-export-outline
                </v-icon>
              </template>
              <p>{{ $t("theseView.exporter") }}</p>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(exportType, index) in exportTypeList"
              :key="index"
            >
              <v-list-item-title class="export-titles">{{ $t(index) }}</v-list-item-title>
              <v-list-item-subtitle v-for="file in exportType">
                <nuxt-link :to="file.url">{{ file.title }}</nuxt-link>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-menu>
<!--        Fin export-->
        <NuxtLink class="nuxt-link" v-if="!organisme && !personne" :to="{ name: 'signaler', query: { 'nnt': nnt, 'source': source, 'etabPpn': etabPpn } }" target="_blank">
          <v-btn flat append-icon="mdi-alert-circle" variant="outlined">
            <template v-slot:append-icon>
              <v-icon>
                mdi-alert
              </v-icon>
            </template>
            <p>{{ $t("theseView.alert") }}</p>
          </v-btn>
        </NuxtLink>
        <v-btn v-if="personne" href="https://documentation.abes.fr/aidetheses/thesesfr/index.html#jai-une-question"
          alt="Documentation de theses.fr" target="_blank" variant="outlined" flat append-icon="mdi-alert-circle">
          {{ $t("theseView.alert") }}
        </v-btn>
        <v-btn v-if="organisme" href="https://documentation.abes.fr/aidetheses/thesesfr/index.html#PageOrganisme"
          alt="Document theses.fr sur les pages d'organisme" target="_blank" variant="outlined" flat
          append-icon="mdi-alert-circle">
          {{ $t("theseView.alert") }}
        </v-btn>
      </div>
    </div>
    <div v-else-if="personne" class="thesis-toolbar no-wrap-text">
      <v-btn href="https://documentation.abes.fr/aidetheses/thesesfr/index.html#jai-une-question"
             alt="Documentation de theses.fr" target="_blank" variant="outlined" flat append-icon="mdi-alert-circle">
        {{ $t("theseView.alert") }}
      </v-btn>
    </div>
    <div v-else-if="organisme" class="thesis-toolbar no-wrap-text">
      <v-btn href="https://documentation.abes.fr/aidetheses/thesesfr/index.html#PageOrganisme"
             alt="Document theses.fr sur les pages d'organisme" target="_blank" variant="outlined" flat
             append-icon="mdi-alert-circle">
        {{ $t("theseView.alert") }}
      </v-btn>
    </div>
    <div v-else class="thesis-toolbar no-wrap-text">
      <NuxtLink class="nuxt-link" :to="{ name: 'signaler', query: { 'nnt': nnt, 'source': source, 'etabPpn': etabPpn } }" target="_blank">
        <v-btn flat append-icon="mdi-alert-circle" variant="outlined">
          <template v-slot:append-icon>
            <v-icon>
              mdi-alert
            </v-icon>
          </template>
          <p>{{ $t("theseView.alert") }}</p>
        </v-btn>
      </NuxtLink>
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, defineAsyncComponent, computed } from 'vue';
import { useDisplay } from "vuetify";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const { mobile } = useDisplay();

const dialog = ref(false);

const props = defineProps({
  nnt: {
    type: String,
    default: ""
  },
  source: {
    type: String,
    default: "Star"
  },
  etabPpn: {
    type: String,
    default: ""
  },
  organisme: {
    type: Boolean,
    default: false
  },
  personne: {
    type: Boolean,
    default: false
  }
});

const isBackAvailable = computed(() => {
  return window.history.state.back && window.history.state.back.includes("/resultats");
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

/**
 * Fonctions
 */
function previousPage() {
  window.history.back();
}
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.no-wrap-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.thesis-toolbar {
  height: 60px;
  width: 100%;
  padding: 0 10px;
  margin: 0.6em 0;

  display: inline-flex;
  align-items: center;

  justify-content: space-between;
  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    justify-content: end;
  }

  p {
    color: rgb(var(--v-text-dark-blue));
  }

  :deep(.v-icon--size-default) {
    i {
      opacity: 1 !important;
    }
  }

  .nuxt-link {
    color: rgb(var(--v-text-dark-blue));
  }

  .v-btn {
    margin: 1em;
    text-transform: none;
    display: inline-flex;
    padding: 0 1em;
    letter-spacing: 0.5px;
    max-width: 90%;
    font-weight: 500;

    :deep(.v-btn__content) {
      width: 100%;
      justify-content: space-between;

      i {
        margin-left: 0.3em;
      }

      span {
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    :deep(.mdi-alert-circle) {
      color: rgb(var(--v-theme-error));
    }
    :deep(.mdi-file-export-outline) {
      color: rgb(var(--v-theme-dark-blue));
    }
  }
}

.export-titles {

}


</style>