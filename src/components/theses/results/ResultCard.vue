<template>
    <v-card flat>
        <div class="firstHalf" @click="$router.push({ name: 'these', params: { id: id } })">
            <v-card-title>
                <v-row>
                    <v-col cols="9" md="10">
                        <v-row class="pa-0 ma-0">
                            <span class="line-clamp">
                                <v-chip :class="status" label variant="elevated" class="mr-2">
                                    <span v-if="status === 'enCours'"><v-icon start
                                            icon="mdi-cogs"></v-icon>Préparation</span>
                                    <span v-if="status === 'soutenue'"><v-icon start
                                            icon="mdi-school-outline"></v-icon>Soutenue</span>
                                </v-chip>{{ titre }}
                            </span>
                        </v-row>
                    </v-col>
                    <v-col cols="3" md="2">
                        <v-row class="pr-2 pt-2 justify-end"><span v-if="date">{{ date.slice(-4) }}</span><span v-else>
                                &nbsp;</span></v-row>
                    </v-col>
                </v-row>
            </v-card-title>
        </div>
        <div class="secondHalf">
            <v-card-text class="py-2">{{ $t('resultCard.par') }} <span v-for="(item, index) in auteur" :key="item.ppn">
                    {{ item.prenom }} {{ item.nom }}<span v-if="index < auteur.length - 2">,
                    </span>
                    <span v-if="index == directeurs.length - 2"> {{ $t('theseView.et') }}
                    </span></span> {{ $t('resultCard.dir') }}
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
        default: '01/01/2000'
    },
    auteur: {
        type: Array
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
    id: {
        type: String
    },
    status: {
        type: String,
        default: 'soutenue'
    }

})
</script>

<style scoped lang="scss">
.line-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.v-card {
    border: solid 1px rgb(var(--v-theme-gris-fonce));
}

:deep(.v-card-title) {
    white-space: break-spaces !important;
    font-size: 1rem;
    cursor: pointer;
    min-height: 190px;
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

.soutenue {
    background-color: rgb(var(--v-theme-orange-abes));

}

.enCours {
    background-color: rgb(var(--v-theme-secondary));
    ;
}
</style>