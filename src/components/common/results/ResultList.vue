<template>
  <h1 class="pb-6">{{ nbResult }}{{
      $t(domainName +
        ".resultView.resultats")
    }} :
    {{ query }}</h1>
  <result-pagination
    v-if="!mobile"
    :nb-results=nbResult
    :type="'top'"
    :current-showing-number="currentShowingNumber"
    :current-page="currentPage"
    @updateNumber="updateNumber"
    @updatePage="updatePage"
    @search="search">
  </result-pagination>


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
      @search="search"
    />
  </v-col>

  <result-pagination
    v-if="!mobile"
    :nb-results=nbResult
    :type="'bottom'"
    :current-showing-number="currentShowingNumber"
    :current-page="currentPage"
    @updateNumber="updateNumber"
    @updatePage="updatePage"
    @search="search">
  </result-pagination>
</template>


<script setup>
import ResultPagination from '@/components/common/results/ResultPagination.vue';
import ScrollToTopButton from "@/components/common/ScrollToTopButton.vue";
import MoreResultsButton from "@/components/common/results/MoreResultsButton.vue";
import PersonnesCard from '@/components/personnes/results/PersonnesCard.vue';
import ResultCard from '@/components/theses/results/ResultCard.vue';
import { useDisplay } from "vuetify";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { APIService } from "@/services/StrategyAPI";

const currentRoute = useRoute();
const { mobile } = useDisplay();
const { getQuery } = APIService();

const domainName = ref(currentRoute.query.domaine);

const props = defineProps({
  result: {
    type: Array,
    required: true
  },
  dataReady: {
    type: Boolean
  },
  nbResult: {
    type: Number
  },
  loading: {
    type: Boolean
  },
  resetPage: {
    type: Number,
    default: 1
  },
  resetShowingNumber: {
    type: Number,
    default: 10
  },
});

const currentShowingNumber = ref(10);
const currentPage = ref(1);
const query = ref("");

onMounted(() => {
  query.value = getQuery();
})

/**
 * Emits
 */

const emit = defineEmits('search');

/**
 * Fonctions
 */

function moreThanXResults(x) {
  return (props.result.length >= x);
}

function allResultsWereLoaded() {
  return moreThanXResults(props.nbResult);
}

function updateNumber(newNumber) {
  currentShowingNumber.value = newNumber;
}

function updatePage(newPage) {
  currentPage.value = newPage;
}

function search() {
  query.value = getQuery();
  emit('search');
}

/**
 * Watchers
 */
watch(() => props.resetPage, () => {
  currentPage.value = 1;
  query.value = getQuery();
});

watch(() => props.resetShowingNumber, () => {
  currentShowingNumber.value = 10;
});
</script>