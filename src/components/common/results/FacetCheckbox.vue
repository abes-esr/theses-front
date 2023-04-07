<template>
  <v-lazy :min-height="10" :options="{ threshold: 1.0 }">
    <v-checkbox
      v-model="checkboxState"
      :class="`checkboxes ms-${props.marginOffset}`"
      :label="`${facetItem.label} (${facetItem.value})`"
      density="compact"
      inline
      hide-details>
    </v-checkbox>
  </v-lazy>

  <template v-if="(recursionDepth <= maxRecursionDepth)
    && facetItem.checkboxes
    && facetItem.checkboxes.length">
    <div v-for="facetItem in childrenCheckboxes" :key="`facet-${facetItem.name}`">
      <facet-checkbox :facet-item="facetItem" :facet-name="facetName" :margin-offset="props.marginOffset + 4"
        :parent-checkbox-state="checkboxState" :facets-array="facetsArray" @updateParentCheckbox="updateSelfCheckbox"
        @updateFilterDataRecursive="updateFilterDataRecursive" />
    </div>
  </template>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const emit = defineEmits(['updateParentCheckbox', 'updateFilterData', 'updateFilterDataRecursive']);
const props = defineProps({
  facetsArray: {
    type: Object
  },
  facetItem: {
    type: Object
  },
  marginOffset: {
    type: Number,
    default: 0
  },
  parentCheckboxState: {
    type: Boolean
  },
  facetName: {
    type: String
  }
});

const maxRecursionDepth = 3;
const recursionDepth = props.marginOffset / 4;  // Multiple de 4 (utilisation de la variable marginOffset) => niveau 2 = 4
const checkboxState = ref(arrayContainsFilter());

let childrenCheckboxes = computed(() => {
  if (props.facetItem.checkboxes) {
    return props.facetItem.checkboxes;
  }
  return [];
});

/**
 * Watchers
 */
// décocher les éléments enfants si la case est décochée
watch(() => props.parentCheckboxState,
  async (newValue) => {
    if (newValue === false) {
      checkboxState.value = false;
    }
  });

// Mise à jour de facetsArray depuis les composants parents
watch(props.facetsArray,
  () => {
    checkboxState.value = arrayContainsFilter();
  }
);

watch(checkboxState, async (newValue) => {
  // Faire remonter le nom du filtre
  const filterData = {
    filterName: props.facetItem.name,
    value: newValue,
    label: props.facetItem.label,
  };

  if (props.marginOffset === 0) {
    // Niveau 1 de récursion → sortir
    emit("updateFilterData", filterData);
  } else {
    emit('updateFilterDataRecursive', filterData);
  }

  // cocher les éléments parents si la case est cochée
  if (newValue === true) {
    emit("updateParentCheckbox", true);
  }
});

/**
 * Functions
 */
function updateSelfCheckbox(payload) {
  checkboxState.value = payload;
}

function updateFilterDataRecursive(filterData) {
  // Faire remonter le nom du filtre à travers les composants parents
  if (props.marginOffset === 0) {
    // Niveau 1 de récursion → sortir
    emit("updateFilterData", filterData);
  } else {
    emit('updateFilterDataRecursive', filterData);
  }
}

function isDateFilter(filter) {
  return Object.keys(filter)[0].toLowerCase().startsWith("date");
}

function arrayContainsFilter() {
  if (props.facetsArray) {
    return props.facetsArray.filter(function (filter) {
      if(isDateFilter(filter) ) {
        return false;
      }
      return Object.values(filter)[0].toLowerCase() === props.facetItem.name.toLowerCase() && Object.keys(filter)[0].toLowerCase() === props.facetName.toLowerCase();
    }
    ).length > 0;
  }
  return false;
}
</script>

<style lang="scss">
  .v-selection-control {
    align-items: start !important;
  }

  .v-label {
    align-items: start !important;
  }
</style>