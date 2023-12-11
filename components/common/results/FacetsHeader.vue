<template>
  <div class="search-filter">
    <div class="filter-meta">
      <v-icon color="primary" class="menu-icon">mdi-filter-menu</v-icon>
      <span class="facet-title-header">{{ $t('results.facetsHeader') }}</span>
    </div>
    <v-btn v-if="!mobile" @click.stop="" @click="searchAndReinitializeAllFacets" size="small" depressed elevation="0"
      color="surface" class="desktop-reinitialize-button">
      Réinitialiser
    </v-btn>
    <button v-else @click="closeOverlay" class="close-overlay-button" elevation="0" color="transparent">
      <div class="close-overlay-icon-wrapper">
        <div class="circle"></div>
        <div class="close-icon"><v-icon size="35">mdi-close-box</v-icon></div>
      </div>
    </button>
  </div>
  <div v-if="mobile" class="reinitialize-button-mobile">
    <v-btn @click.stop="" @click="searchAndReinitializeAllFacets" class="reinitialize-button-mobile" size="small"
      depressed elevation="0">
      Réinitialiser
    </v-btn>
  </div>
</template>

<script setup>
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();
const { reinitializeFilters } = useStrategyAPI();

const emit = defineEmits(['closeOverlay', 'reinitializePageNumber']);

function searchAndReinitializeAllFacets() {
  emit('reinitializePageNumber');
  reinitializeFilters();
}

function closeOverlay() {
  emit('closeOverlay');
}
</script>

<style lang="scss" scoped>
@use 'vuetify/settings';

.search-filter {
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 10%;
  padding-right: 2%;
  width: 100%;
  min-height: 4rem;
  font-size: 22px;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
    padding-left: 7%;
    padding-right: 2%;
    font-size: 16px;
  }
}

.filter-meta {
  height: 2rem;
  display: inline-grid;
  grid-template-columns: 10px 30px 10px 40px;
  grid-template-rows: 20% 60% 20%;
}

.menu-icon {
  height: 100%;
  grid-column-start: 1;
  grid-row-start: 2;
}

.facet-title-header {
  height: 100%;
  grid-column-start: 3;
  background-color: transparent;
  padding: 10% 0;
  overflow: visible !important;

  font-size: 22px;
  font-weight: 400;
  font-family: Roboto-Regular, sans-serif;
  color: rgb(var(--v-text-dark-blue));
}

.v-btn--elevated :deep(.v-btn__content) {
  text-transform: capitalize;
  letter-spacing: 0.5px;
  color: rgb(var(--v-theme-secondary-darken-2));
}

.reinitialize-button-mobile {
  margin-top: 5px;
  margin-right: 0.3em;
  display: grid;
  justify-self: end;
}

.desktop-reinitialize-button {
  height: 2em;
  align-self: flex-start;
  margin-top: 12px;
  font-weight: 400;
  background-color: transparent !important;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
    font-size: 10px;
    padding: 0 4px;
  }
}
</style>