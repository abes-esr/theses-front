<template>
  <!--  Personnes-->
  <div v-if="domainName === 'personnes'">
    <div v-for="item in result" :key="item.id" class="card-wrapper">
      <personnes-card :item="item" />
    </div>
  </div>
  <!--  Thèses-->
  <div v-else-if="domainName === 'theses'">
    <div v-for="item in result" :key="item" class="card-wrapper">
      <result-card :titre="item.titrePrincipal" :date="item.dateSoutenance" :auteur="item.auteurs"
                   :directeurs="item.directeurs" :discipline="item.discipline" :etab="item.etabSoutenanceN"
                   :id="item.id"
                   :status="item.status">
      </result-card>
    </div>
  </div>
</template>

<script setup>
  import ResultCard from "@/components/theses/results/ResultCard.vue";
  import PersonnesCard from "@/components/personnes/results/PersonnesCard.vue";
  import { ref } from "vue";
  import { useRoute } from "vue-router";

  const currentRoute = useRoute();
  const domainName = ref(currentRoute.query.domaine);
  const props = defineProps({
    result: {
      type: Array,
      required: true
    }
  });
</script>

<style lang="scss">
.card-wrapper {
  margin-bottom: 1rem;
}
</style>