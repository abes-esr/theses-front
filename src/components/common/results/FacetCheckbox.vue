<template>
  <v-lazy :min-height="10" :options="{ threshold: 1.0 }">
    <v-checkbox v-model="checkboxState" @click="updateCheckbox" :class="`checkboxes ms-${props.marginOffset}`"
      :label="`${replaceFacetsText(facetItem.label)} (${facetItem.value})`" density="compact" inline hide-details>
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
import { computed, onMounted, ref, watch } from "vue";
import { APIService } from "@/services/StrategyAPI";
import { replaceFacetsText } from "@/services/Common";

const { addToFiltersLabelsMap } = APIService();

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

onMounted(() => {
  const filterData = {
    filterName: props.facetItem.name,
    label: props.facetItem.label,
  };

  addToFiltersLabelsMap(filterData);
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

/**
 * Functions
 */
function updateCheckbox(payload) {
  const receivedEmitFromChild = typeof payload !== 'object';
  const newValue = receivedEmitFromChild ? payload : !checkboxState.value;

  // Faire remonter le nom du filtre
  const filterData = {
    filterName: props.facetItem.name,
    value: newValue,
    label: props.facetItem.label
  };
console.log(filterData)
  if (props.marginOffset === 0) {
    // Niveau 1 de récursion → sortir
    emit("updateFilterData", filterData);
  } else {
    emit("updateFilterDataRecursive", filterData);

    // cocher les éléments parents si la case est cochée
    if (newValue === true) {
      emit("updateParentCheckbox", true);
    }
  }
}

function updateSelfCheckbox(payload) {
  if (payload === true && checkboxState.value === false) {
    updateCheckbox(payload);
    checkboxState.value = payload;
  }
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
  return Object.keys(filter)[0].startsWith("date");
}

function arrayContainsFilter() {
  if (props.facetsArray) {
    return props.facetsArray.filter(function (filter) {
      if (isDateFilter(filter)) {
        return false;
      }
      return Object.values(filter)[0] === props.facetItem.name && Object.keys(filter)[0] === props.facetName;
    }
    ).length > 0;
  }
  return false;
}
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.v-selection-control {
  align-items: start !important;
}

:deep(.v-label) {
  align-items: start;
  padding-top: 3px;
  color: rgb(var(--v-theme-primary));
  opacity: 1 !important;
  font-size: 15px !important;
  font-family: Roboto-Medium, sans-serif;
  font-weight: 500;
}

:deep(.v-selection-control__wrapper) {
  align-self: start;
}
</style>