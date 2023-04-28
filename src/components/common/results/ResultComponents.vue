<template>
  <result-pagination v-if="!mobile" :nb-results=nbResult :type="'top'" :current-showing-number="currentShowingNumber"
    :current-page-number="currentPageNumber" @updateNumber="updateNumber" @updatePage="updatePage" @search="search">
  </result-pagination>

  <div class="result-components-wrapper">
    <Transition mode="out-in">
      <h2 class="returned-results-statement" v-if="dataReady">
        <span>{{ $t("results.searched") }}{{'\xa0'}}</span>
        <span class="orange-text">"{{ query }}"{{'\xa0'}}</span>
        <span>{{ $t("results.returned") }}{{'\xa0'}}</span>
        <span class="orange-text">{{ nbResult }}{{'\xa0'}}</span>
        <span>{{ $t("results.results") }}</span>
      </h2>
      <h1 v-else>Recherche...</h1>
    </Transition>
    <facets-chips :facets="facets" @deleteFilter="deleteFilter" />
    <div v-if="dataReady" class="colonnes-resultats">
      <div>
        <result-list :result="result" :domain-name-change="domainNameChange">
        </result-list>
        <MoreResultsButton v-if="mobile && !allResultsWereLoaded()" :loading=loading :nb-result=nbResult
          @updateNumber="updateNumber" @search="search" />
      </div>
      <ScrollToTopButton v-if="moreThanXResults(5)" class="scroll-to-top-wrapper" :nb-result=nbResult />
    </div>
    <div v-else>
      <div v-for="i in currentShowingNumber" :key="i" class="skeleton">
        <v-card flat style="margin-bottom: 1rem;"><v-skeleton-loader type="article"></v-skeleton-loader></v-card>
      </div>
    </div>
  </div>

  <result-pagination v-if="!mobile" :nb-results=nbResult :type="'bottom'" :current-showing-number="currentShowingNumber"
    :current-page-number="currentPageNumber" class="pagination-bottom" @updateNumber="updateNumber"
    @updatePage="updatePage" @search="search">
  </result-pagination>
</template>


<script setup>
import ResultPagination from "@/components/common/results/ResultPagination.vue";
import ScrollToTopButton from "@/components/common/ScrollToTopButton.vue";
import MoreResultsButton from "@/components/common/results/MoreResultsButton.vue";
import { useDisplay } from "vuetify";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { APIService } from "@/services/StrategyAPI";
import ResultList from "@/components/common/results/ResultList.vue";
import FacetsChips from "@/components/common/results/FacetsChips.vue";

const currentRoute = useRoute();
const { mobile } = useDisplay();
const { getQuery, setShowingNumber } = APIService();

const domainName = currentRoute.query.domaine ? ref(currentRoute.query.domaine) : ref('theses');

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
    type: Number
  },
  resetShowingNumber: {
    type: Number
  },
  domainNameChange: {
    type: String
  },
  facets: {
    type: Array
  }
});

const query = ref("");

const currentPageNumber = currentRoute.query.page ? ref(parseInt(currentRoute.query.page)) : ref(1);
const currentShowingNumber = currentRoute.query.nb ? ref(parseInt(currentRoute.query.nb)) : ref(10);

onMounted(() => {
  query.value = getQuery();
});

/**
 * Emits
 */

const emit = defineEmits(['search', 'deleteFilter']);

function deleteFilter(facet) {
  emit('deleteFilter', facet);
}
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
  setShowingNumber(currentShowingNumber.value);
}

function updatePage(newPage) {
  currentPageNumber.value = newPage;
}

function search() {
  query.value = getQuery();
  emit('search');
}

/**
 * Watchers
 */
watch(() => props.resetPage, () => {
  currentPageNumber.value = 1;
  query.value = getQuery();
});

watch(() => props.resetShowingNumber, () => {
  currentShowingNumber.value = 10;
});
</script>

<style lang="scss">
@use 'vuetify/settings';

.colonnes-resultats {
  padding: 0;
  display: grid;
  grid-template-columns: 95% auto;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    grid-template-columns: none;
    margin-right: 1rem;
  }
}

.scroll-to-top-wrapper {
  position: sticky;
  top: 90vh;
  margin-bottom: 3rem;
  margin-left: 10%;
  width: 30px;
  height: 30px;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    margin: 0 0;
    height: 60px;
    left: 90vw;
    top: unset;
    bottom: 5vh;
  }
}

.bottom-buttons-line {
  display: flex;
  justify-content: center;
}

.result-components-wrapper {
  padding: 1rem 0 2rem 1rem;
  flex: 1;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    padding-bottom: 0;
  }
}

.pagination-bottom {
  position: relative;
  bottom: 0;
  z-index: 10;
}

.v-card {
  margin-bottom: 1rem;
  border: solid 1px rgb(var(--v-theme-gris-fonce));
  min-height: 190px;

}

.skeleton {
  padding: 0;
  display: grid;
  grid-template-columns: 95%
}

//Animations texte
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.returned-results-statement {
  display: inline-block;
  font-family: Roboto-Medium, sans-serif;
  font-weight: 500;
  font-size: 26.5px;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
    font-size: 24.5px;
  }
}

.orange-text {
  color: rgb(var(--v-theme-orange-abes));
  font-family: Roboto-Bold, sans-serif;
  font-weight: 700;
}
</style>