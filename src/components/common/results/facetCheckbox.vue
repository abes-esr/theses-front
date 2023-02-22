<template>
  <div
    v-for="facetItem in facetItems"
    :key="`facet-${facetItem.name}`">
    <v-checkbox
      :class="`checkboxes ms-${props.marginOffset}`"
      :label="`${facetItem.name} (${facetItem.value})`"
      density="compact"
      hide-details="true"
    ></v-checkbox>

    <template v-if="facetItem.children && facetItem.children.length">
      <facet-checkbox :facet-items="facetItem.children" :margin-offset="props.marginOffset+4" />
    </template>
  </div>

  <!--#TODO relier le cochage en cascade -->

  <!--        <v-checkbox :label="`Soutenues : ${facets.statut.soutenue ? facets.status.soutenue : 0}`" value="soutenues"-->
  <!--                    v-model="filtres" @update:modelValue="untickAccessible"></v-checkbox>-->
  <!--        <v-checkbox class="pl-4" :label="`Accessibles en ligne : ${facets.accessible.oui ? facets.accessible.oui : 0}`"-->
  <!--                    value="accessible" v-model="filtres"></v-checkbox>-->
  <!--        <v-checkbox :label="`En préparation : ${facets.status.enCours ? facets.status.enCours : 0}`" value="enCours"-->
  <!--                    v-model="filtres"></v-checkbox>-->
</template>

<script setup>
  const props = defineProps({
    facetItems: {
      type: Object
    },
    marginOffset: {
      type: Number,
      default: 0
    }
  });
</script>

<style scoped>
.checkboxes {
  text-transform: capitalize;
}
</style>