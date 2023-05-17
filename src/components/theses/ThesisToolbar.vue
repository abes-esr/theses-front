<template>
  <div v-if="!mobile" class="thesis-toolbar no-wrap-text">
    <v-btn flat prepend-icon="mdi-arrow-left-circle"
           @click="previousPage"
    >
      <template v-slot:prepend-icon>
        <v-icon>
          mdi-arrow-left-circle
        </v-icon>
      </template>
      <p>{{ $t("theseView.retour") }}</p>
    </v-btn>
    <span></span>
    <div class="no-wrap-text">
      <v-btn flat prepend-icon="mdi-arrow-left-circle">
        <template v-slot:prepend-icon>
          <v-icon>
            mdi-arrow-left-circle
          </v-icon>
        </template>
        <p>{{ $t("theseView.thesePrecedente") }}</p>
      </v-btn>
      <v-btn flat append-icon="mdi-arrow-right-circle">
        <template v-slot:append-icon>
          <v-icon>
            mdi-arrow-right-circle
          </v-icon>
        </template>
        <p>{{ $t("theseView.theseSuivante") }}</p>
      </v-btn>
    </div>
    <span></span>
    <div class="no-wrap-text">
      <v-btn flat append-icon="mdi-alert">
        <template v-slot:append-icon>
          <v-icon>
            mdi-alert
          </v-icon>
        </template>
        <p>{{ $t("theseView.alert") }}</p>
      </v-btn>
      <v-btn flat append-icon="mdi-file-export-outline">
        <template v-slot:append-icon>
          <v-icon>
            mdi-file-export-outline
          </v-icon>
        </template>
        <p>{{ $t("theseView.exporter") }}</p>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();



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
  height: 42px;
  width: 100%;
  padding: 0 10px;
  background-color: rgb(var(--v-theme-gris-clair));

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
    color: rgb(var(--v-theme-orange-abes));

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
    border: solid 1px rgb(var(--v-theme-gris-fonce));
  }

}
</style>