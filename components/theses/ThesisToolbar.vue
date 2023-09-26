<template>
  <MessageBox ref="messageBox"></MessageBox>
  <div v-if="!mobile" class="thesis-toolbar no-wrap-text">
    <v-btn flat prepend-icon="mdi-arrow-left-circle" @click="previousPage">
      <template v-slot:prepend-icon>
        <v-icon>
          mdi-arrow-left-circle
        </v-icon>
      </template>
      <p>{{ $t("theseView.retour") }}</p>
    </v-btn>
    <span></span>
    <div class="no-wrap-text">
      <v-btn class="arrow-buttons" flat icon="mdi-chevron-left">
        <template v-slot:icon>
          <v-icon size="x-large">
            mdi-arrow-left-circle
          </v-icon>
        </template>
        <!--        <p>{{ $t("theseView.thesePrecedente") }}</p>-->
      </v-btn>
      <v-btn class="arrow-buttons" flat icon="mdi-chevron-right">
        <template v-slot:icon>
          <v-icon size="x-large">
            mdi-arrow-right-circle
          </v-icon>
        </template>
        <!--        <p>{{ $t("theseView.theseSuivante") }}</p>-->
      </v-btn>
    </div>
    <span></span>
    <div class="no-wrap-text">
      <v-btn flat append-icon="mdi-file-export-outline">
        <template v-slot:append-icon>
          <v-icon>
            mdi-file-export-outline
          </v-icon>
        </template>
        <p>{{ $t("theseView.exporter") }}</p>
      </v-btn>
      <v-btn flat append-icon="mdi-alert" @click="dialog = true">
        <template v-slot:append-icon>
          <v-icon>
            mdi-alert
          </v-icon>
        </template>
        <p>{{ $t("theseView.alert") }}</p>
      </v-btn>
    </div>
  </div>

  <!-- Modal signaler une erreur -->

  <v-dialog v-model="dialog" persistent :fullscreen="mobile" :width="mobile ? '100%' : '70%'">
    <v-card style="padding: 2rem 2rem;">
      <LazyThesesReportErrorView @close="dialog = false" @done="mailSent" :source="props.source" :nnt="props.nnt"
        :etab-ppn="props.etabPpn"></LazyThesesReportErrorView>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue';
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
  }
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
  height: 42px;
  width: 100%;
  padding: 0 10px;
  margin: 0.6em 0;

  display: inline-flex;
  justify-content: space-between;
  align-items: center;

  p {
    font-size: 13px;
    font-weight: 400;
    font-family: Roboto-Medium, sans-serif;
    color: rgb(var(--v-text-dark-blue));
  }

  :deep(.v-icon--size-default) {
    i {
      opacity: 1 !important;
    }
  }

  .v-btn {
    height: 25px;

    letter-spacing: unset;
    text-transform: unset;
    text-indent: unset;

    margin: 0 8px;
    border: solid 1px rgb(var(--v-theme-primary));
  }

  .arrow-buttons {
    border: unset;
    height: 2.4em;
    width: 2.4em;

    :deep(.v-btn__content) {
      i {
        --v-icon-size-multiplier: 1.4;
      }
    }
  }
}
</style>