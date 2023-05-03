<template>
  <div class="facets">
    <div class="search-filter">
      <div class="filter-meta">
        <v-icon color="primary" class="menu-icon">mdi-certificate</v-icon>
        <span class="facet-title-header">{{ $t("theseView.valide") }}</span>
      </div>
    </div>
    <!-- <facet-drawer v-if="domaine === 'theses' && Object.keys(facets).length > 0" date key="facet-date" -->
    <!-- v-for sur la liste des bouttons -->
    <v-skeleton-loader
      v-if="loading"
      v-for="i in 6"
      :key="i"
      type="list-item"
      class="skeleton"
    ></v-skeleton-loader>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useDisplay } from "vuetify";

const props = defineProps({
});

const { mobile } = useDisplay();

</script>

<style scoped lang="scss">
@use "vuetify/settings";

.search-filter {
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10%;
  width: 100%;
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
  grid-template-columns: 1fr 1fr 10fr;
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
  grid-row-start: 2;
  background-color: transparent;
  margin-top: -3px;
  overflow: visible !important;

  font-size: 16px;
  font-weight: 400;
  font-family: Roboto-Regular, sans-serif;
  color: rgb(var(--v-text-dark-blue));
}

.facets {
  display: flex;
  flex-direction: column;

  .v-expansion-panels {
    width: 85%;
  }

  .skeleton {
    height: 48px !important;
    width: 85%;
    background-color: rgb(var(--v-theme-gris-clair));
    margin-bottom: 1em;
  }

  .filters-btn {
    margin-top: 15px;
  }
}
</style>
