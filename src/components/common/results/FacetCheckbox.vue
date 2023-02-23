<template>
    <v-checkbox
      :class="`checkboxes ms-${props.marginOffset}`"
      :label="`${facetItem.name} (${facetItem.value})`"
      v-model="checkboxState"
      density="compact"
      hide-details="true"
    ></v-checkbox>

    <template v-if="(props.marginOffset < maxRecursionDepth) && facetItem.children && facetItem.children.length">
      <div
        v-for="facetItem in facetItem.children"
        :key="`facet-${facetItem.name}`"
      >
        <facet-checkbox
          :facet-item="facetItem"
          :margin-offset="props.marginOffset+4"
          :parent-checkbox-state="checkboxState"
          @updateParentCheckbox="updateSelfCheckbox"
        />
      </div>
    </template>

  <!--#TODO relier le cochage en cascade -->

  <!--        <v-checkbox :label="`Soutenues : ${facets.statut.soutenue ? facets.status.soutenue : 0}`" value="soutenues"-->
  <!--                    v-model="filtres" @update:modelValue="untickAccessible"></v-checkbox>-->
  <!--        <v-checkbox class="pl-4" :label="`Accessibles en ligne : ${facets.accessible.oui ? facets.accessible.oui : 0}`"-->
  <!--                    value="accessible" v-model="filtres"></v-checkbox>-->
  <!--        <v-checkbox :label="`En préparation : ${facets.status.enCours ? facets.status.enCours : 0}`" value="enCours"-->
  <!--                    v-model="filtres"></v-checkbox>-->
</template>

<script setup>
  import { ref, watch } from "vue";

  const maxRecursionDepth = 8; // Multiple de 4 (utilisation de la variable marginOffset) => niveau 2 = 4
  const emit = defineEmits(["updateParentCheckbox"]);

  const props = defineProps({
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

  let checkboxState = ref(false);

  /**
   * décocher les éléments enfants si l acase est décochée
   */
  watch(() => props.parentCheckboxState,
    async (newValue) => {
    if(newValue === false) {
      checkboxState.value = false;
    }
  });

  /**
   * cocher les éléments parents si la case est cochée
   */
  watch(checkboxState, async (newValue) => {
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
</script>

<style scoped>
.checkboxes {
  text-transform: capitalize;
}
</style>