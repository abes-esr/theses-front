<template>
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

  <div class="result-components-wrapper">
    <h1>{{ nbResult }}{{
        $t(domainName +
          ".resultView.resultats")
      }} : {{ query }}
    </h1>
    <facets-chips :facets="facets" @deleteFilter="deleteFilter" />
    <div v-if="dataReady" class="colonnes-resultats">
        <div>
          <result-list :result="result" :domain-name-change="domainNameChange">
          </result-list>
            <MoreResultsButton
              v-if="mobile && !allResultsWereLoaded()"
              :loading=loading
              :nb-result=nbResult
              @updateNumber="updateNumber"
              @search="search"
            />
        </div>
        <ScrollToTopButton v-if="moreThanXResults(5)" class="scroll-to-top-wrapper" :nb-result=nbResult />
    </div>
  </div>

  <result-pagination
    v-if="!mobile"
    :nb-results=nbResult
    :type="'bottom'"
    :current-showing-number="currentShowingNumber"
    :current-page="currentPage"
    class="pagination-bottom"
    @updateNumber="updateNumber"
    @updatePage="updatePage"
    @search="search">
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
const { getQuery, modifierNombre, getCurrentPage, getCurrentShowingNumber } = APIService();

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
const currentPage = ref(getCurrentPage());
const currentShowingNumber = ref(getCurrentShowingNumber());

onMounted(() => {
  query.value = getQuery();
})

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
  modifierNombre(newNumber);
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
</style>