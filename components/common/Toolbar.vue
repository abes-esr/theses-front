<template>
  <ClientOnly>
    <MessageBox ref="messageBox"></MessageBox>
  </ClientOnly>

  <ClientOnly>
    <div v-if="!mobile" class="thesis-toolbar no-wrap-text" role="list">
      <div v-if="isBackAvailable" role="listitem" class="v-btn-container">
        <v-btn flat prepend-icon="mdi-arrow-left-circle-outline" variant="outlined" role="button" @click="previousPage">
          <template v-slot:prepend-icon>
            <v-icon>
              mdi-arrow-left-circle
            </v-icon>
          </template>
          <p>{{ $t("theseView.retour") }}</p>
        </v-btn>
      </div>
      <span v-else></span>
      <div class="no-wrap-text" role="presentation">
        <!--        Export-->
        <CommonExportButton :nnt="nnt" v-if="these" />
        <!--        Fin export-->
        <!--        Signaler-->
        <div role="listitem" class="v-btn-container">
          <v-btn class="nuxt-link" v-if="!organisme && !personne" flat append-icon="mdi-alert-circle" variant="outlined"
            :to="{ name: 'signaler', query: { 'nnt': nnt, 'source': source, 'etabPpn': etabPpn } }" target="_blank"
            role="button">
            <template v-slot:append-icon>
              <v-icon>
                mdi-alert
              </v-icon>
            </template>
            <p>{{ $t("theseView.alert") }}</p>
          </v-btn>
        </div>
        <!--        Fin signaler-->
        <v-btn v-if="personne" href="https://documentation.abes.fr/aidethesesfr/index.html#jai-une-question"
          :alt="$t('footer.accessDoc')" target="_blank" variant="outlined" flat append-icon="mdi-alert-circle"
          role="listitem">
          {{ $t("theseView.alert") }}
        </v-btn>
        <v-btn v-if="organisme" href="https://documentation.abes.fr/aidethesesfr/index.html#PageOrganisme"
          :alt="$t('theseView.docOrganismes')" target="_blank" variant="outlined" flat append-icon="mdi-alert-circle"
          role="listitem">
          {{ $t("theseView.alert") }}
        </v-btn>
      </div>
    </div>
    <!--    Mobile-->
    <div v-else-if="personne" class="thesis-toolbar no-wrap-text" role="list">
      <v-btn href="https://documentation.abes.fr/aidetheses/thesesfr/index.html#jai-une-question"
        :alt="$t('footer.accessDoc')" target="_blank" variant="outlined" flat append-icon="mdi-alert-circle"
        role="listitem">
        {{ $t("theseView.alert") }}
      </v-btn>
    </div>
    <div v-else-if="organisme" class="thesis-toolbar no-wrap-text">
      <v-btn href="https://documentation.abes.fr/aidetheses/thesesfr/index.html#PageOrganisme"
        :alt="$t('theseView.docOrganismes')" target="_blank" variant="outlined" flat append-icon="mdi-alert-circle"
        role="listitem">
        {{ $t("theseView.alert") }}
      </v-btn>
    </div>
    <div v-else class="thesis-toolbar no-wrap-text">

      <!--        Export-->
      <CommonExportButton :nnt="nnt" />
      <!--        Export-->
      <!--      Signaler une erreur-->
      <v-btn :to="{ name: 'signaler', query: { 'nnt': nnt, 'source': source, 'etabPpn': etabPpn } }" target="_blank"
        flat append-icon="mdi-alert-circle" class="nuxt-link" variant="outlined" role="listitem">
        <template v-slot:append-icon>
          <v-icon>
            mdi-alert
          </v-icon>
        </template>
        <p>{{ $t("theseView.alert") }}</p>
      </v-btn>
      <!--      Signaler une erreur-->
    </div>
    <!--    Fin Mobile-->
  </ClientOnly>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";

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
  these: {
    type: Boolean,
    default: false
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

  .v-btn-container {
    display: inline-flex;

    .v-btn {
      margin: 1em;
      padding: 0 1em;
      max-width: 90%;
      text-transform: none;
      letter-spacing: 0.5px;
      font-weight: 500;
    }

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
  }
}
</style>