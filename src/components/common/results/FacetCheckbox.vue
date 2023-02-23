<template>
    <v-checkbox
      :class="`checkboxes ms-${props.marginOffset}`"
      :label="`${facetItem.name} (${facetItem.value})`"
      v-model="checkboxState"
      density="compact"
      hide-details="true"
    ></v-checkbox>

    <template v-if="facetItem.children && facetItem.children.length">
      <div
        v-for="facetItem in facetItem.children"
        :key="`facet-${facetItem.name}`"
      >
        <facet-checkbox
          :facet-item="facetItem"
          :margin-offset="props.marginOffset+4"
          :parent-checkbox-state="checkboxState"
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
  // let refParentCheckboxState = ref(props.parentCheckboxState);

  watch(() => props.parentCheckboxState, (newValue) => {
    if(newValue === false) {
      checkboxState.value = false;
    }
  });

  watch(() => checkboxState, (newValue, oldValue) => {
    if(newValue === true) {
      // emit
    }
  });
</script>

<style scoped>
.checkboxes {
  text-transform: capitalize;
}
</style>