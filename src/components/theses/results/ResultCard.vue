<template>
    <v-card flat>
        <div class="firstHalf">
            <v-card-title>
                <v-row>
                    <v-col cols="9" md="10">
                        <v-row class="pa-0 ma-0">
                            <span class="line-clamp">
                                <v-chip color="orange-abes" label variant="elevated" class="mr-2">
                                    <v-icon start icon="mdi-school-outline"></v-icon>
                                    {{ $t('theseView.soutenueChip') }}
                                </v-chip>{{ titre }}
                            </span>
                        </v-row>
                    </v-col>
                    <v-col cols="3" md="2">
                        <v-row class="pr-2 pt-2 justify-end">{{ date.slice(-4) }}</v-row>
                        <v-row class="pt-5 pr-1 mb-0 justify-end">
                            <v-btn flat size="small" append-icon="mdi-arrow-right-bold-circle-outline" color="primary"
                                @click="$router.push({ name: 'these', params: { nnt: nnt } })">
                                Voir</v-btn>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card-title>
        </div>
        <div class="secondHalf">
            <v-card-text class="py-2">{{ $t('resultCard.par') }} {{ auteur }} {{ $t('resultCard.dir') }}
                <span v-for="(item, index) in directeurs" :key="item.ppn"> {{ item.prenom }} {{ item.nom }}<span
                        v-if="index < directeurs.length - 2">,
                    </span>
                    <span v-if="index == directeurs.length - 2"> {{ $t('theseView.et') }}
                    </span></span>
            </v-card-text>
            <v-card-text class="pt-0 pb-4">{{ discipline }} - {{ etab }}</v-card-text>
        </div>
    </v-card>
</template>
<script>
export default {
  name: "result-card",
};
</script>
<script setup>
defineProps({
    titre: {
        type: String,
        default: ''
    },
    date: {
        type: String,
        default: ''
    },
    auteur: {
        type: String
    },
    directeurs: {
        type: Array
    },
    discipline: {
        type: String,
        default: 'Discipline'
    },
    etab: {
        type: String,
        default: 'Université'
    },
    nnt: {
        type: String
    }

})
</script>

<style scoped>
.line-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.v-card {
    border: solid 1px rgb(var(--v-theme-gris-fonce));
    height: 190px;
}

:deep(.v-card-title) {
    white-space: break-spaces !important;
    font-size: 1rem;
}

.firstHalf {
    height: 60%;
    width: 100%;
}

.secondHalf {
    background-color: rgb(var(--v-theme-gris-clair)) !important;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40%;
}

.subtitle {
    font-size: 0.9rem;
    font-weight: 400;
}
</style>