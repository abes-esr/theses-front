<template>
    <v-card flat>
        <div class="icon-wrapper">
            <v-icon class="icon">{{ icon }}</v-icon>
            <v-badge v-if="badge" class="badge" :icon="badge" :color="badgecolor" />
        </div>
        <v-card-title class="d-flex justify-center pb-1">
            <h3> {{ titre }} </h3>
        </v-card-title>
        <v-card-subtitle class="d-flex justify-center">{{ description }}</v-card-subtitle>
        <v-card-text class="d-flex justify-center pt-2 pb-3">{{ date }}</v-card-text>
        <a href="#" style="text-decoration: none;">
            <v-row class="pa-0 pb-5 ma-0 d-flex justify-center">
                <h4>{{ $t("explorer") }}</h4>
                <v-icon color="orange-abes" class="pl-2">mdi-arrow-right-circle</v-icon>
            </v-row>
        </a>
    </v-card>
</template>


<script setup>
defineProps({
    titre: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    date: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        default: 'mdi-school'
    },
    badgecolor: {
        type: String
    },
    badge: {
        type: String
    }
});
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

h3 {
    color: rgb(var(--v-theme-secondary-darken-2));
}

.v-card {
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
    color: rgb(var(--v-theme-primary));
    opacity: 1;
    font-size: 1.2rem;
    font-weight: 400;
}

.v-card-text {
    color: rgb(var(--v-theme-primary));
    font-style: italic;
}

.icon {
    font-size: 40px;
    color: white;
}

.icon-wrapper {
    position: absolute;
    top: -35px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgb(var(--v-theme-secondary));
    border-radius: 10%;
    padding: 5px;
}

.badge {
    position: absolute;
    top: 3px;
    right: -3px;
}

:deep(.v-badge__badge) {
    height: 1.5rem !important;
    width: 1.5rem !important;
    border-radius: 100%;
}

:deep(.v-badge__badge > .v-icon) {
    padding-left: 1px;
    color: white !important;
    font-size: 20px;
}
</style>