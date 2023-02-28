<template>
    <v-checkbox
      :class="`checkboxes ms-${props.marginOffset}`"
      :label="`${facetItem.name} (${facetItem.value})`"
      v-model="checkboxState"
      density="compact"
      hide-details="true"
    ></v-checkbox>

    <template v-if="(recursionDepth <= maxRecursionDepth)
                      && facetItem.checkboxes
                      && facetItem.checkboxes.length">
      <div
        v-for="facetItem in childrenCheckboxes.value"
        :key="`facet-${facetItem.name}`"
      >
        <facet-checkbox
          :facet-item="facetItem"
          :facet-name="facetName"
          :margin-offset="props.marginOffset+4"
          :parent-checkbox-state="checkboxState"
          :facets-array="facetsArray"
          @updateParentCheckbox="updateSelfCheckbox"
          @updateFacetDataRecursive="updateFacetDataRecursive"
        />
      </div>
    </template>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { sortByAlphaNumericOrder } from "@/services/Common";

  const emit = defineEmits(['updateParentCheckbox','updateFacetData', 'updateFacetDataRecursive']);
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
  const recursionDepth = props.marginOffset/4;  // Multiple de 4 (utilisation de la variable marginOffset) => niveau 2 = 4
  const checkboxState = ref(arrayContainsFilter());

  let childrenCheckboxes = computed(() => {
    return sortByAlphaNumericOrder(props.facetItem.checkboxes);
  });

  /**
   * Watchers
   */
  // décocher les éléments enfants si la case est décochée
  watch(() => props.parentCheckboxState,
    async (newValue) => {
    if(newValue === false) {
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
    const itemData = {
      filterName: props.facetItem.name,
      value: newValue
    }

    if(props.marginOffset === 0) {
      // Niveau 1  de récursion => sortir
      emit("updateFacetData", itemData);
    } else {
      emit('updateFacetDataRecursive', itemData)
    }

    // cocher les éléments parents si la case est cochée
    if(newValue === true) {
      emit("updateParentCheckbox", true);
    }
  });

/**
 * Functions
 */
function updateSelfCheckbox(payload) {
  checkboxState.value = payload;
}

function updateFacetDataRecursive(itemData) {
  // Faire remonter le nom du filtre à travers les composants parents
  if(props.marginOffset === 0) {
    // Niveau 1  de récursion => sortir
    emit("updateFacetData", itemData);
  } else {
    emit('updateFacetDataRecursive', itemData)
  }
}
function arrayContainsFilter() {
  if(props.facetsArray) {
    return props.facetsArray.filter(function(filter) {
      return Object.values(filter)[0] === props.facetItem.name && Object.keys(filter)[0] === props.facetName
    }
    ).length > 0;
  }
  return false;
}
</script>

<style scoped>
.checkboxes {
  text-transform: capitalize;
}
</style>