<template>
  <div class="search-filter">
    <div class="filter-meta">
      <v-icon color="primary" class="menu-icon">mdi-filter-menu</v-icon>
      <div class="facet-title">
        <p>{{ $t('results.facetsHeader') }}</p>
      </div>
    </div>
    <v-btn v-if="!mobile" @click.stop="" @click="searchAndReinitializeAllFacets" size="small" depressed elevation="0"
      color="primary" class="desktop-reinitialize-button">
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
      depressed elevation="0" color="primary">
      Réinitialiser
    </v-btn>
  </div>
</template>

<script setup>
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();

const emit = defineEmits(['searchAndReinitializeAllFacets', 'closeOverlay']);

function searchAndReinitializeAllFacets() {
  emit('searchAndReinitializeAllFacets');
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
  padding: 0 10%;
  width: 100%;
  min-height: 4rem;
  background-color: rgb(var(--v-theme-gris-clair));
  font-size: 22px;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
    padding: 0 7%;
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

.facet-title {
  height: 100%;
  grid-row-start: 2;
  grid-column-start: 3;
  background-color: transparent;
  padding: 10% 0;
  overflow: visible !important;
}

.v-btn--elevated :deep(.v-btn__content) {
  text-transform: capitalize;
  letter-spacing: 0.5px;
}

.close-overlay-button {
  width: 35px;
  height: 35px;
  position: relative;
}

.circle {
  border-radius: 50%;
  width: 25px;
  height: 25px;
  position: absolute;
  top: 5px;
  left: 5px;
  background: rgb(var(--v-theme-surface));
}

.close-icon {
  color: rgb(var(--v-theme-orange-abes));
  position: absolute;
  top: 0;
  left: 0;
}



.reinitialize-button-mobile {
  margin-top: 5px;
  display: grid;
  grid-template-columns: 7.5% 85% 7.5%;
}

.reinitialize-button-mobile {
  grid-column-end: 3;
  justify-self: end;
}

.desktop-reinitialize-button {
  padding: 0 12px;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
    font-size: 10px;
    padding: 0 4px;
  }
}
</style>