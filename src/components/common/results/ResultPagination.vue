<template>
  <div class="result-pagination">
    <v-row>
      <v-col cols="4" v-if="type === 'top'">
        <v-row class="left-row">
          <span class="pt-5 first-bar-element">Afficher</span>
          <v-select :items="['10', '25', '50']" v-model="currentShowingNumber" density="compact" variant="underlined"
                    style="max-width: 50px;" class="mx-2 pt-2" color="orange-abes">
          </v-select>
          <span class="pt-5">résultats par page</span>
        </v-row>
      </v-col>
      <v-col>
        <v-pagination
            class="pt-1"
            :length="nbPages"
            total-visible="2"
            v-model="currentPage"
            @update:modelValue="scrollToTop">
        </v-pagination>
      </v-col>
      <v-col cols="4" class="last-col" v-if="type === 'top'">
        <v-select v-model="tri" class="ml-2 pt-2 last-bar-element" return-object :items=items item-title="nom" item-value="cle" density="compact"
                  variant="underlined" color="orange-abes">
        </v-select>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { APIService } from "@/services/StrategyAPI";
import { scrollToTop } from "@/services/Common";
import { useRoute } from "vue-router";

const currentRoute = useRoute();
const { modifierTri, modifierPage, modifierNombre, getItemsTri } = APIService();
const emit = defineEmits(['search', 'updatePage', 'updateNumber']);
const domainName = ref(currentRoute.query.domaine);

const props = defineProps({
  nbResults: {
    type: Number,
    default: 1
  },
  type: {
    Type: String,
    default: 'top'
  },
  currentPage: {
    type: Number,
    default: 1
  },
  currentShowingNumber: {
    type: Number,
    default: 10
  }
});


const items = ref(getItemsTri());

const tri = ref({ nom: "Pertinence", cle: "pertinence" });

const currentShowingNumber = ref(10);
const currentPage = ref(1);

const nbPages = computed(() => {
  return Math.ceil(props.nbResults / currentShowingNumber.value);
});

watch(currentPage, newCurrentPage => {
  modifierPage(newCurrentPage);
  emit('search');
  emit('updatePage', newCurrentPage);
});

watch(currentShowingNumber, newShowingNumber => {
  modifierNombre(newShowingNumber);
  emit('search');
  modifierPage(1);
  emit('updateNumber', newShowingNumber);
  emit('updatePage', 1);
});

watch(tri, async (newTri) => {
  modifierPage(1);
  emit('updatePage', 1);
  modifierTri(newTri.cle);
  emit('search');
});


/**
 * Watcher des autres barres de pagination
 */
watch(() => props.currentPage, () => {
  currentPage.value = props.currentPage;
});

watch(() => props.currentShowingNumber, () => {
  currentShowingNumber.value = props.currentShowingNumber;
});

// Mise à jour des valeurs de tri
watch(() => currentRoute.query.domaine, () => {
  items.value = getItemsTri();
});

</script>
<style scoped lang="scss">
@use '../../../../node_modules/vuetify/settings';

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