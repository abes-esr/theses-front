<template>
  <div class="result-pagination">
    <v-row>
      <v-col cols="4">
        <v-row class="left-row">
          <span class="pt-5 first-bar-element">Afficher</span>
          <v-select :items="['10', '25', '50']" v-model="currentNombre" density="compact" variant="underlined"
                    style="max-width: 50px;" class="mx-2 pt-2" color="orange-abes">
          </v-select>
          <span class="pt-5">résultats par page</span>
        </v-row>
      </v-col>
      <v-col cols="4">
        <v-pagination
            class="pt-1"
            :length="nbPages"
            total-visible="2"
            v-model="parentCurrentPage">
        </v-pagination>
      </v-col>
      <v-col cols="4" class="last-col">
        <v-select v-model="tri" class="ml-2 pt-2 last-bar-element" return-object :items=items item-title="nom" item-value="cle" density="compact"
                  variant="underlined" color="orange-abes">
        </v-select>
      </v-col>
    </v-row>
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

.result-pagination {
  background-color: rgb(var(--v-theme-gris-clair));
  max-height: 4rem;
  display: grid;
}

.v-pagination {
  background-color: transparent;
  width: unset;
}

.v-select {
  flex: 1 0 auto;
}

.first-bar-element {
  margin-left: 3rem;
}

.last-col {
  display: flex;
  justify-content: end;
}

.last-bar-element {
  margin-right: 3rem;
  max-width: 200px;
}

.left-row {
  margin: 0;
}
</style>