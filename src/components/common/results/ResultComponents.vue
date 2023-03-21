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
    <h1 class="pb-6">{{ nbResult }}{{
        $t(domainName +
          ".resultView.resultats")
      }} : {{ query }}
    </h1>
    <div v-if="dataReady" class="colonnes-resultats">
        <div>
          <result-list :result="result">
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
    @updateNumber="updateNumber"
    @updatePage="updatePage"
    @search="search">
  </result-pagination>
</template>


<script setup>
import ResultPagination from '@/components/common/results/ResultPagination.vue';
import ScrollToTopButton from "@/components/common/ScrollToTopButton.vue";
import MoreResultsButton from "@/components/common/results/MoreResultsButton.vue";
import { useDisplay } from "vuetify";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { APIService } from "@/services/StrategyAPI";
import ResultList from "@/components/common/results/ResultList.vue";

const currentRoute = useRoute();
const { mobile } = useDisplay();
const { getQuery, modifierNombre } = APIService();

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

.colonnes-resultats {
  padding: 0;
  display: grid;
  grid-template-columns: 95% auto;
}

.scroll-to-top-wrapper {
  margin-bottom: 3rem;
  margin-left: 10%;
}

.result-components-wrapper {
  padding: 1rem 0 2rem 1rem;
}
</style>