<template>
    <v-card flat>
      <h2 :id="icon + '-heading'" class="sr-only">{{ $t('explorer') + ' ' + titre.toLocaleString() + ' ' + description }}</h2>
      <div :aria-labelledby="icon + '-heading'" tabindex="-1">
        <a :href="url" style="text-decoration: none;" :title="info">
            <ClientOnly>
                <div v-if="icon === 'soutenue' || icon === 'enCours'" class="icon-wrapper">
                    <ThesesResultsThesisIcon :status="icon"></ThesesResultsThesisIcon>
                </div>
                <div v-else class="icon-wrapper personne-icon">
                    <IconPersonne></IconPersonne>
                </div>
            </ClientOnly>
            <v-card-title class="d-flex justify-center pb-1">
                <span class="thesis-number" v-if="titre !== 0"> {{ titre.toLocaleString() }} </span>
                <v-progress-circular v-else indeterminate color="primary"></v-progress-circular>
            </v-card-title>
            <v-card-subtitle class="d-flex justify-center">{{ description }}</v-card-subtitle>
            <v-row class="pa-0 pb-5 ma-0 d-flex justify-center">
                <span class="explorer">{{ $t("explorer") }}</span>
                <v-icon color="orange-abes" class="pl-2">mdi-arrow-right-circle</v-icon>
            </v-row>
        </a>
      </div>
    </v-card>
</template>


<script setup>
import IconPersonne from '../icons/IconPersonne.vue';

defineProps({
    titre: {
        type: Number,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    url: {
        type: String,
        default: "#"
    },
    icon: {
        type: String,
        default: "soutenue"
    },
    info: {
        type: String,
        default: null
    }
});
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.thesis-number {
    color: rgb(var(--v-theme-secondary-darken-2));
    font-size: 35px;
    font-weight: 900;
}

.explorer {
    font-size: 19px;
    font-weight: 700;
    color: rgb(var(--v-theme-primary));
    text-transform: uppercase;
}

.v-card {
    border-radius: 0;
    border: solid 1px rgb(var(--v-theme-gris-clair));
    overflow: visible;
    padding-top: 20px;
    margin-top: 40px;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-up')} {
        margin-top: 0;
    }
}

.v-card-title {
    font-size: 1.8rem;
}

.v-card-subtitle {
    padding-top: 10px;
    padding-bottom: 15px;
    padding-right: 5px;
    padding-left: 5px;
    color: rgb(var(--v-theme-primary));
    opacity: 1;
    font-size: 20px;
    font-weight: 300;
    letter-spacing: normal;
    white-space: break-spaces;
    text-align: center;
}

.icon-wrapper {
    position: absolute;
    top: -35px;
    left: 50%;
    transform: translateX(-50%);
    padding-left: 25px;
}

.personne-icon {
    top: -25px;
    padding-left: unset !important;
}
</style>