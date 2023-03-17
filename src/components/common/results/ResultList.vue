<template>
  <h1 class="pb-6">{{ nbResult }}{{
      $t(domaineNameChange +
        ".resultView.resultats")
    }} :
    {{ request }}</h1>
  <result-pagination-top
    v-if="!mobile"
    v-model:current-page=currentPage
    :nb-results=nbResult
    @changePage="updatePage"
    @changeNombre="updateNombre"
    @changeTri="updateTri">
  </result-pagination-top>


  <v-col cols="1" class="colonnes-resultats">
    <ScrollToTopButton v-if="moreThanXResults(5)" class="scroll-top-wrapper" :nb-result=nbResult />
  </v-col>
  <v-col v-if="dataReady" cols="11" class="colonnes-resultats">
<!--  Personnes-->
    <v-row v-if="domainName === 'personnes'">
      <v-col v-for="item in result" :key="item.id" cols="12">
        <personnes-card :item="item" />
      </v-col>
    </v-row>
<!--  Thèses-->
    <v-row v-else-if="domainName === 'theses'">
      <v-col v-for="item in result" :key="item" cols="12">
        <result-card :titre="item.titrePrincipal" :date="item.dateSoutenance" :auteur="item.auteurs"
                     :directeurs="item.directeurs" :discipline="item.discipline" :etab="item.etabSoutenanceN"
                     :id="item.id"
                     :status="item.status">
        </result-card>
      </v-col>
    </v-row>
    <MoreResultsButton
      v-if="mobile && !allResultsWereLoaded()"
      :loading=loading
      :nb-result=nbResult
      @changeNombre="updateNombre"
    />
  </v-col>

  <result-pagination-bottom
    v-if="!mobile"
    v-model:current-page=currentPage
    :nb-results=nbResult
    :current-nombre=currentNombre
    @changePage="simpleUpdatePage">
  </result-pagination-bottom>
</template>


<script setup>
import ResultPaginationTop from '@/components/common/results/ResultPaginationTop.vue';
import ResultPaginationBottom from '@/components/common/results/ResultPaginationBottom.vue';
import ScrollToTopButton from "@/components/common/ScrollToTopButton.vue";
import MoreResultsButton from "@/components/common/results/MoreResultsButton.vue";
import PersonnesCard from '@/components/personnes/results/PersonnesCard.vue';
import ResultCard from '@/components/theses/results/ResultCard.vue';
import { useDisplay } from "vuetify";
import { ref } from "vue";
import { useRoute } from "vue-router";

const currentRoute = useRoute();
const { mobile } = useDisplay();

const domainName = ref(currentRoute.query.domaine);

const props = defineProps({
  request: {
    type: String
  },
  result: {
    type: Array,
    required: true
  },
  dataReady: {
    type: Boolean
  },
  nbResults: {
    type: Number
  }
});

/**
 * Emits
 */

/**
 * Fonctions
 */

function moreThanXResults(x) {
  return (props.result.value.length >= x);
}

function allResultsWereLoaded() {
  return moreThanXResults(props.nbResult.value);
}

</script>

<style scoped>

</style>