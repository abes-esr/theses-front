<template>
  <div class="result-pagination">
      <span class="pt-5 first-bar-element">Afficher</span>
      <v-select :items="['10', '25', '50']" v-model="currentNombre" density="compact" variant="underlined"
                style="max-width: 50px;" class="mx-2 pt-2" color="orange-abes">
      </v-select>
      <span class="pt-5">résultats par page</span>
      <v-pagination
        class="pt-1"
        :length="nbPages"
        total-visible="2"
        v-model="parentCurrentPage">
    </v-pagination>
      <v-select v-model="tri" return-object :items=items item-title="nom" item-value="cle" density="compact"
                variant="underlined" style="max-width: 200px;" class="ml-2 pt-2 last-bar-element" color="orange-abes">
      </v-select>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const emit = defineEmits(["changePage", "changeNombre", "changeTri"]);

const props = defineProps({
  nbResults: {
    type: Number,
    default: 1
  },
  currentPage: {
    type: Number,
    default: 1
  }
});

let items = [
  { nom: "Pertinence", cle: "pertinence" },
  { nom: "Date croissante", cle: "dateAsc" },
  { nom: "Date décroissante", cle: "dateDesc" },
  { nom: "Auteurs A-Z", cle: "auteursAsc" },
  { nom: "Auteurs Z-A", cle: "auteursDesc" },
  { nom: "Discipline A-Z", cle: "disciplineAsc" },
  { nom: "Discipline Z-A", cle: "disciplineDesc" }
];

let parentCurrentPage = ref(props.currentPage);
let tri = ref({ nom: "Pertinence", cle: "pertinence" });
let currentNombre = ref(10);

let nbPages = computed(() => {
  return Math.ceil(props.nbResults / currentNombre.value);
});

watch(parentCurrentPage, async (newCurrentPage) => {
  emit("changePage", newCurrentPage);
});

watch(() => props.currentPage,
  (newValue, oldValue) => {
    parentCurrentPage.value = newValue;
});

watch(currentNombre, async (newCurrentNombre) => {
  emit("changeNombre", newCurrentNombre);
});

watch(tri, async (newTri) => {
  parentCurrentPage.value = 1;
  emit("changeTri", newTri.cle);
});

</script>
<style scoped lang="scss">
@use 'vuetify/settings';

.v-pagination {
  max-width: 40vw;
  flex: 1 0 auto;
  background-color: transparent;
}

.v-select {
  flex: 1 0 auto;
}

.result-pagination {
  background-color: rgb(var(--v-theme-gris-clair));
  max-height: 4rem;
}

.first-bar-element {
  margin-left: 3rem;
}

.last-bar-element {
  margin-right: 3rem;
}
</style>