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
        <!--
      <v-btn flat append-icon="mdi-file-export-outline">
        <template v-slot:append-icon>
          <v-icon>
            mdi-file-export-outline
          </v-icon>
        </template>
        <p>{{ $t("theseView.exporter") }}</p>
      </v-btn>
    -->
        <v-btn v-if="!organisme && !personne" flat append-icon="mdi-alert-circle" variant="outlined"
          @click="dialog = true">
          <template v-slot:append-icon>
            <v-icon>
              mdi-alert
            </v-icon>
          </template>
          <p>{{ $t("theseView.alert") }}</p>
        </v-btn>
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
  </ClientOnly>

  <ClientOnly>
    <v-dialog v-model="dialog" persistent :fullscreen="mobile" :width="mobile ? '100%' : '70%'">
      <v-card style="padding: 2rem 2rem;">
        <LazyThesesReportErrorView @close="dialog = false" @done="mailSent" :source="props.source" :nnt="props.nnt"
          :etab-ppn="props.etabPpn"></LazyThesesReportErrorView>
      </v-card>
    </v-dialog>
  </ClientOnly>
</template>

<script setup>
import { ref, defineAsyncComponent, computed } from 'vue';
import { useDisplay } from "vuetify";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const MessageBox = defineAsyncComponent(() => import('../components/common/MessageBox.vue'));
const messageBox = ref(null);
function displayMessage(message) {
  messageBox.value?.open(message, {
    type: "success"
  });
}

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


/**
 * Fonctions
 */
function previousPage() {
  window.history.back();
}

function mailSent() {
  displayMessage(t('reportErrorView.msg'));
  dialog.value = false;
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
  justify-content: space-between;
  align-items: center;

  p {
    color: rgb(var(--v-text-dark-blue));
  }

  :deep(.v-icon--size-default) {
    i {
      opacity: 1 !important;
    }
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

    :deep(.v-btn__append) {
      color: rgb(var(--v-theme-error));
    }
  }
}
</style>