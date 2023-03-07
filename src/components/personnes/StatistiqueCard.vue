<template>
  <ul>
    <template v-for="(value, name) in stats" :key="name">
      <li v-if="value != 0 "> {{ $t('personnes.personneView.statistiques.' + name) }} : <span>{{ value }}</span>
        {{ $t('personnes.personneView.statistiques.theses') }}
      </li>
    </template>
  </ul>
</template>
<script>
export default {
  name: "statistique-card-personne"
};
</script>
<script setup>

defineProps({
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

  li {
    margin: 0.2rem 0 0.2rem 0;
    font-size: 18px;

    @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
      font-size: 22px;
    }

    span {
      color: rgb(var(--v-theme-orange-abes));
    }
  }
}

</style>