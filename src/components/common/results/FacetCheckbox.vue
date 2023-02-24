<template>
    <v-checkbox
      :class="`checkboxes ms-${props.marginOffset}`"
      :label="`${facetItem.name} (${facetItem.value})`"
      v-model="checkboxState"
      density="compact"
      hide-details="true"
    ></v-checkbox>

    <template v-if="(recursionDepth <= maxRecursionDepth)
                      && facetItem.children
                      && facetItem.children.length">
      <div
        v-for="facetItem in facetItem.children"
        :key="`facet-${facetItem.name}`"
      >
        <facet-checkbox
          :facet-item="facetItem"
          :margin-offset="props.marginOffset+4"
          :parent-checkbox-state="checkboxState"
          @updateParentCheckbox="updateSelfCheckbox"
          @updateFacetDataRecursive="updateFacetDataRecursive"
        />
      </div>
<!--          v-model:facets-array="facetsArray"-->
<!--          @update:facets-array="newValue => facetsArray[facetItem.name] = newValue"-->
    </template>
</template>

<script setup>
import { ref, watch } from "vue";

  const emit = defineEmits(['updateParentCheckbox','updateFacetData', 'updateFacetDataRecursive']);
  const props = defineProps({
    facetsArray: {
      type: Array
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
    }
  });

  const maxRecursionDepth = 3;
  const recursionDepth = props.marginOffset/4;  // Multiple de 4 (utilisation de la variable marginOffset) => niveau 2 = 4
  const checkboxState = ref(false);

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
</script>

<style scoped>
.checkboxes {
  text-transform: capitalize;
}
</style>