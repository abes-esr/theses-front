<template>
    <v-row>
        <v-col cols="12" md="4" class="py-0">
            <div class="d-flex justify-start"><span class="pt-5">Afficher</span>
                <v-select :items="['10', '25', '50']" v-model="currentNombre" density="compact" variant="underlined"
                    style="max-width: 50px;" class="mx-2 pt-2">
                </v-select> <span class="pt-5">résultats par page</span>
            </div>
        </v-col>
        <v-col cols="12" md="4" class="py-0 pt-1">
            <div class="d-flex justify-center">
                <v-pagination :length="6" v-model="currentPage"></v-pagination>
            </div>
        </v-col>
        <v-col cols="12" md="4" class="py-0">
            <div class="d-flex justify-end"><span class="pt-5">Trier par</span>
                <v-select :items="['Alphabétique', 'Inversé']" density="compact" variant="underlined"
                    style="max-width: 140px;" class="ml-2 pt-2">
                </v-select>
            </div>
        </v-col>
    </v-row>
</template>

<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['changePage', 'changeNombre'])

let currentPage = ref(1);
let currentNombre = ref(10);

watch(currentPage, async (newCurrentPage) => {
    emit('changePage', newCurrentPage);
})

watch(currentNombre, async (newCurrentNombre) => {
    emit('changeNombre', newCurrentNombre);
})

</script>