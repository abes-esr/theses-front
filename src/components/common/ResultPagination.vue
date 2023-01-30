<template>
    <v-row class="result-pagination">
        <v-col cols="12" md="4" class="py-0">
            <div class="d-flex justify-start"><span class="pt-5">Afficher</span>
                <v-select :items="['10', '25', '50']" v-model="currentNombre" density="compact" variant="underlined"
                    style="max-width: 50px;" class="mx-2 pt-2">
                </v-select> <span class="pt-5">résultats par page</span>
            </div>
        </v-col>
        <v-col cols="12" md="4" class="py-0 pt-1">
            <div class="d-flex justify-center">
                <v-pagination :length="nbPages" v-model="currentPage" total-visible="5"></v-pagination>
            </div>
        </v-col>
        <v-col cols="12" md="4" class="py-0">
            <div class="d-flex justify-end"><span class="pt-5">Trier par</span>
                <v-select v-model="tri" return-object :items=items item-title="nom" item-value="cle" density="compact"
                    variant="underlined" style="max-width: 200px;" class="ml-2 pt-2">
                </v-select>
            </div>
        </v-col>
    </v-row>
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

</style>