<template>
  <ul>
    <template v-for="(value, name) in stats" :key="name">
      <li v-if="value != 0 "> {{ name }} : {{ value }} thèse(s)</li>
    </template>
  </ul>
</template>
<script>
export default {
  name: "statistique-card-personne"
};
</script>
<script setup>

const props = defineProps({
  stats: {
    type: Object,
    required: true
  }
})

</script>
<style scoped lang="scss">
@use 'vuetify/settings';

ul {
  list-style: none;

  li::before {
    content: "•";
    width: 5rem;
    color: rgb(var(--v-theme-orange-abes));
    margin-right: 0.5rem;

  }
}

</style>