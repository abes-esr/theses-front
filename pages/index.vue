<template>
    <v-container>
        <!-- Mobile -->
        <ClientOnly>
            <CommonHeaderMobile v-if="mobile" type="home" @displayError="displayError" @activate-menu="activateMenu"
                :loading="loading" :show-menu="showMenu"></CommonHeaderMobile>
        </ClientOnly>
        <NuxtLink v-if="!mobile" class="logo logo_home" :to="{ name: 'index', query: { domaine: 'theses' } }">
            <img alt="Logo du site theses.fr" id="logoIMG" src="@/assets/icone-theses-beta.svg" />
        </NuxtLink>
        <div class="main-wrapper">
            <ClientOnly><Message-box ref="messageBox"></Message-box></ClientOnly>
            <div class="justify-center max-height-200">
                <h1 class="text-center">{{ $t("slogan") }}</h1>
            </div>
            <CommonDomainSelector></CommonDomainSelector>
            <GenericSearchBar @search="loading = true" :loading="loading" @onError="displayError" />
            <div class="stats">
                <HomeStatsCard :titre=nbTheses :description="$t('referencés')" badge="mdi-check" badgecolor="green"
                    url="/resultats?filtres=%255BStatut%253D%2522soutenue%2522%255D&q=*&page=1&nb=10&tri=dateDesc&domaine=theses">
                </HomeStatsCard>
                <HomeStatsCard :titre=nbSujets :description="$t('preparation')" badge="mdi-progress-clock"
                    badgecolor="orange"
                    url="/resultats?filtres=%255BStatut%253D%2522enCours%2522%255D&q=*&page=1&nb=10&tri=dateDesc&domaine=theses">
                </HomeStatsCard>
                <HomeStatsCard :titre=nbPersonnes :description="$t('personnesRef')" icon="mdi-account"
                    url="/resultats?q=*&page=1&nb=10&tri=PersonnesAsc&domaine=personnes"></HomeStatsCard>
            </div>
            <br />
        </div>
    </v-container>
</template>

<script setup>
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useDisplay } from "vuetify";


const MessageBox = defineAsyncComponent(() => import("@/components/common/MessageBox.vue"));
const { reinitializeResultData } = useStrategyAPI();
const { getStatsTheses, getStatsSujets } = useThesesAPI();
const { getStatsPersonnes } = usePersonnesAPI();
const { mobile } = useDisplay();

const loading = ref(false);
const showMenu = ref(false);
const messageBox = ref(null);

const { data: nbSujets } = await getStatsSujets();
const { data: nbTheses } = await getStatsTheses();
const { data: nbPersonnes } = await getStatsPersonnes();

useSeoMeta({
    title: `Theses.fr`,
    ogTitle: `Theses.fr`,
    description: "Moteur de recherche des thèses françaises, theses.fr propose l’accès aux thèses de doctorat soutenues ou en préparation.",
    ogDescription: "Moteur de recherche des thèses françaises, theses.fr propose l’accès aux thèses de doctorat soutenues ou en préparation."
})
onMounted(() => {
    // réinitialiser les éléments liés à la recherche au retour à la page d'accueil
    reinitializeResultData();
});

function displayError(message) {
    messageBox.value?.open(message, {
        type: "error"
    });
}

/**
 * Fonctionnement du header mobile
 */
function activateMenu() {
    sleep(250).then(() => {
        showMenu.value = !showMenu.value;
    });
}

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

//Container pour afficher l'image de fond
.v-container {
    padding: 0;
    max-width: none;
    height: 100% !important;
    display: flex !important;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    background-image: url(@/assets/background.svg);
    background-repeat: repeat-x;
    background-size: auto 50%;
    background-position: bottom -80px left -10px;

    @media #{ map-get(settings.$display-breakpoints, 'xs')} {
        background-size: auto 25%;
        background-position: bottom -50px center;
        background-attachment: fixed;
    }
}

#logoIMG {
    margin-top: 10px;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
        margin-top: 20px;
    }
}

.main-wrapper {
    width: 90vw;

    @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
        width: 50vw;
    }

    h1 {
        color: rgb(var(--v-theme-text-dark-blue));
        font-weight: 300;
        font-size: 24px;
        line-height: 28px;
        margin-top: -20px;

        @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
            font-size: 38px;
            line-height: 40px;
            margin-top: -10px;
        }
    }

    .searchbar {
        width: 100%;
    }

    .stats {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: column;
        width: 100%;
        padding: 40px 0 10px;

        @media #{ map-get(settings.$display-breakpoints, 'sm-and-up')} {
            max-height: 500px;
            flex-direction: row;
        }

        .v-card {
            width: 100%;
            height: 160px !important;
            margin-top: 55px;
        }

        @media #{ map-get(settings.$display-breakpoints, 'sm-and-up')} {
            .v-card {
                flex: 1 0 30%;
                max-width: 30%;
                margin-top: 0px;
            }
        }

        :deep(.v-card-subtitle) {
            height: 3.5rem !important;
            align-items: center;
        }


    }

    :deep(.v-divider) {
        margin-top: 0 !important;
    }

    p {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 60px;
        margin-bottom: 2rem;
    }

    .max-height-200 {
        max-height: 200px;
    }
}

.mobile-nav-bar {
    margin-top: 50px !important;
}
</style>