<template>
    <div class="result-pagination">
        <span class="pt-5">Afficher</span>
        <v-select :items="['10', '25', '50']" v-model="currentNombre" density="compact" variant="underlined"
            style="max-width: 50px;" class="mx-2 pt-2">
        </v-select> <span class="pt-5">résultats par page</span>
        <v-pagination :length="nbPages" v-model="currentPage" total-visible="5"></v-pagination>
        <span class="pt-5">Trier par {{ nbResults }}</span>
        <v-select v-model="tri" return-object :items=items item-title="nom" item-value="cle" density="compact"
            variant="underlined" style="max-width: 200px;" class="ml-2 pt-2">
        </v-select>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const emit = defineEmits(['changePage', 'changeNombre', 'changeTri'])

const props = defineProps({
    nbResults: {
        type: Number,
        default: 1
    }
})

let items = [
    { nom: 'Pertinence', cle: 'pertinence' },
    { nom: 'Date croissante', cle: 'dateAsc' },
    { nom: 'Date décroissante', cle: 'dateDesc' },
    { nom: 'Auteurs A-Z', cle: 'auteursAsc' },
    { nom: 'Auteurs Z-A', cle: 'auteursDesc' },
    { nom: 'Discipline A-Z', cle: 'disciplineAsc' },
    { nom: 'Discipline Z-A', cle: 'disciplineDesc' }
]

let tri = ref({ nom: 'Pertinence', cle: 'pertinence' })
let currentPage = ref(1);
let currentNombre = ref(10);

const nbPages = computed(() => {
    return Math.ceil(props.nbResults / currentNombre.value);
})

watch(currentPage, async (newCurrentPage) => {
    emit('changePage', newCurrentPage);
})

watch(currentNombre, async (newCurrentNombre) => {
    emit('changeNombre', newCurrentNombre);
})

watch(tri, async (newTri) => {
    currentPage.value = 1;
    emit('changeTri', newTri.cle);
})

</script>
<style scoped lang="scss">
@use 'vuetify/settings';

.v-pagination {
    max-width: 40vw;
    flex: 1 0 auto;
}

.v-select {
    flex: 1 0 auto;
}
</style>