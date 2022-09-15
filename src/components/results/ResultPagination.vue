<template>
    <v-row>
        <v-col cols="12" md="4" class="py-0">
            <div class="d-flex justify-start"><span class="pt-3">Afficher</span>
                <v-select :items="['10','25','50']" density="compact" style="max-width: 80px;" class="mx-2">
                </v-select> <span class="pt-3">résultats par page</span>
            </div>
        </v-col>
        <v-col cols="12" md="4" class="py-0">
            <div class="d-flex justify-center">
                <v-pagination :length="6"></v-pagination>
            </div>
        </v-col>
        <v-col cols="12" md="4" class="py-0">
            <div class="d-flex justify-end"><span class="pt-3">Trier par</span>
                <v-select :items="['Alphabétique', 'Inversé']" density="compact" style="max-width: 200px;" class="ml-2">
                </v-select>
            </div>
        </v-col>
    </v-row>
</template>