<template>
    <ClientOnly>
        <Message-box ref="messageBox"></Message-box>
    </ClientOnly>

    <!--  Mobile-->
    <ClientOnly>
        <CommonHeaderMobile v-if="mobile" @displayError="displayError" @activateMenu="activateMenu"
            @activateSearchBar="activateSearchBar" :loading="loading" :show-menu="showMenu"
            :show-search-bar="showSearchBar">
        </CommonHeaderMobile>
        <!--  Fin Mobile-->
    </ClientOnly>
    <!--  Desktop-->
    <div v-if="!mobile" class="sub-header">
        <div class="search-bar-container white-containers">
            <div class="sub_header__logo">
                <NuxtLink :to="{ path: '/', query: { domaine: 'theses' } }" :title="$t('homepage')">
                    <img class="logo" :alt="$t('homepage')" id="logoIMG" src="@/assets/icone-theses.svg" />
                </NuxtLink>
                <h1 v-html='$t("slogan2lines")'></h1>
            </div>
            <div class="sub_header__action">
                <CommonDomainSelector></CommonDomainSelector>
                <GenericSearchBar :loading="loading" @onError="displayError" />
            </div>
        </div>
    </div>

    <div class="main-wrapper">
        <div class="result-components white-containers">
            <div class="toolbar-container">
                <CommonToolbar organisme />
            </div>
            <!--   Skeletton-->
            <div v-if="!dataReady" class="skeleton-wrapper">
                <v-skeleton-loader type="list-item-avatar-two-line" class="skeleton"></v-skeleton-loader>
                <v-skeleton-loader type="divider" class="skeleton"></v-skeleton-loader>
                <v-skeleton-loader v-for="i in 4" :key="i" type="paragraph" class="skeleton-cards"></v-skeleton-loader>
            </div>
            <!--      End skeletton-->

            <div class="info-wrapper" v-else>
                <div class="info">
                    <IconsIconOrganisme></IconsIconOrganisme>
                    <div class="nom-card" tabindex="-1" ref="firstFocusElement" aria-labelledby="nomprenom-organisme">
                        <h1 class="nomprenom" id="nomprenom-organisme">
                            {{ name }}
                        </h1>
                        <a :href="`https://www.idref.fr/${props.id}`" class="idref-logo" target="_blank"
                            :alt="$t('footer.idRef')"
                            :title="$t('footer.idRef')">
                            <img :alt="$t('footer.idRef')" id="logoIdref"
                                :src="'/idref-icone-' + colorMode + '.svg'" />
                            <span>IdRef</span>
                        </a>
                    </div>
                </div>
                <!--        Tiroirs thèses-->
                <div class="theses">
                    <v-expansion-panels multiple class="role-expansion-panel-wrapper">
                        <h2 class="sr-only">{{ $t('institutionList') }}</h2>
                        <template
                            v-for="key in ['etabSoutenance', 'etabSoutenanceEnCours', 'partenaireRecherche', 'partenaireRechercheEnCours', 'etabCotutelle', 'etabCotutelleEnCours', 'ecoleDoctorale', 'ecoleDoctoraleEnCours']"
                            :key="key">
                            <div v-if="item[key] && item[key].length > 0" class="role-expansion-panel">
                                <v-expansion-panel>
                                    <v-expansion-panel-title>
                                        <template v-slot:actions="{ expanded }">
                                            <v-icon :icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                                size="x-large">
                                            </v-icon>
                                        </template>
                                        <h3>
                                            {{ $t("organismeView." + key, [item["totalHits" + key]]) }}
                                        </h3>
                                    </v-expansion-panel-title>
                                    <v-expansion-panel-text role="list">
                                        <div role="listitem" v-for="(these, index) in item[key]" :key="these" class="card-wrapper">
                                            <v-lazy :options="{ threshold: 1.0 }">

                                                <ThesesResultsResultCard :titre="these.titrePrincipal"
                                                    :date="these.status === 'enCours' ? these.datePremiereInscriptionDoctorat : these.dateSoutenance"
                                                    :auteur="these.auteurs" :directeurs="these.directeurs"
                                                    :discipline="these.discipline" :etab="these.etabSoutenanceN"
                                                    :etabPPN="these.etabSoutenancePpn" :id="these.id"
                                                    :status="these.status">
                                                </ThesesResultsResultCard>
                                            </v-lazy>
                                            <hr class="result-dividers" v-if="index < item[key].length - 1" />
                                        </div>
                                        <div v-if="item['totalHits' + key] > 100" class="loadMoreButton"><v-btn
                                                variant=outlined size="x-large" @click="voirPlus(key, props.id)">{{
            $t("organismeView.voirPlus") }}</v-btn></div>

                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                            </div>
                        </template>
                    </v-expansion-panels>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { ref, defineAsyncComponent, onMounted, nextTick } from "vue";
import { useDisplay } from "vuetify";
import { useColorMode } from '@vueuse/core';

const colorMode = useColorMode();

const { mobile } = useDisplay();
const { t } = useI18n();

const MessageBox = defineAsyncComponent(() => import('@/components/common/MessageBox.vue'));
const { getName, getOrganisme } = useOrganismeAPI();

const props = defineProps({
    id: {
        type: String,
        required: true
    }
});

const dataReady = ref(false);
const item = ref({});
const name = ref("");
dataReady.value = false;
const loading = ref(false);
const showSearchBar = ref(false);
const showMenu = ref(false);

getOrganisme(props.id).then(result => {
    item.value = result.data.value;
    dataReady.value = true;
}).catch(error => {
    if (error.response) {
        displayError(error.response.data.message, { isSticky: true });
    } else {
        displayError(error.message);
    }
});

getName(props.id).then(result => {
    name.value = result.data.value;
    // Titre détaillé 
    useSeoMeta({
        title: () => `${name.value} | Theses.fr`,
        ogTitle: () => `${name.value} | Theses.fr`,
        description: () => t("meta.descPersonne") + name.value,
        ogDescription: () => t("meta.descPersonne") + name.value,
        ogImage: "https://theses.fr/logo-theses-beta.png",
        ogImageAlt: 'Logo Theses.fr',
        twitterCard: 'summary',
        ogType: 'website',
    });

    useHead({
        meta: [
            { name: 'DC.title', content: `${name.value}` },
            { name: 'DC.description.abstract', content: `${name.value} | Theses.fr` },
            { name: 'DC.source', content: `theses.fr` }
        ]
    });
}).catch(error => {
    if (error.response) {
        displayError(error.response.data.message, { isSticky: true });
    } else {
        displayError(error.message);
    }
});


const firstFocusElement = ref(null);

// Focus sur le contenu de la page au chargement
onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      if (firstFocusElement.value) {
        firstFocusElement.value.focus({ focusVisible: false });
      }
    }, 100);
  });
});


async function voirPlus(contexte, ppn) {
    switch (contexte) {
        case 'etabSoutenance':
            await navigateTo('/resultats?q=etabSoutenancePpn:' + ppn + '&domaine=theses&filtres=%255BStatut%253D%2522soutenue%2522%255D');
            break;
        case 'etabSoutenanceEnCours':
            await navigateTo('/resultats?q=etabSoutenancePpn:' + ppn + '&domaine=theses&filtres=%255BStatut%253D%2522enCours%2522%255D');
            break;
        case 'partenaireRecherche':
            await navigateTo('/resultats?q=partenairesRecherchePpn:' + ppn + '&domaine=theses&filtres=%255BStatut%253D%2522soutenue%2522%255D');
            break;
        case 'partenaireRechercheEnCours':
            await navigateTo('/resultats?q=partenairesRecherchePpn:' + ppn + '&domaine=theses&filtres=%255BStatut%253D%2522enCours%2522%255D');
            break;
        case 'etabCotutelle':
            await navigateTo('/resultats?q=etabsCotutellePpn:' + ppn + '&domaine=theses&filtres=%255BStatut%253D%2522soutenue%2522%255D');
            break;
        case 'etabCotutelleEnCours':
            await navigateTo('/resultats?q=etabsCotutellePpn:' + ppn + '&domaine=theses&filtres=%255BStatut%253D%2522enCours%2522%255D');
            break;
        case 'ecoleDoctorale':
            await navigateTo('/resultats?q=ecolesDoctoralesPpn:' + ppn + '&domaine=theses&filtres=%255BStatut%253D%2522soutenue%2522%255D');
            break;
        case 'ecoleDoctoraleEnCours':
            await navigateTo('/resultats?q=ecolesDoctoralesPpn:' + ppn + '&domaine=theses&filtres=%255BStatut%253D%2522enCours%2522%255D');
            break;
    }
}

const messageBox = ref(null);

function displayError(message, opt) {
    messageBox.value?.open(message, {
        ...opt,
        type: "error"
    });
}

/**
 * Fonctionnement du header mobile
 */
function activateMenu() {
    showSearchBar.value = false;
    sleep(250).then(() => {
        showMenu.value = !showMenu.value;
    });
}

function activateSearchBar() {
    showMenu.value = false;
    sleep(250).then(() => {
        showSearchBar.value = !showSearchBar.value;
    });
}

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.v-menu ::v-deep(.v-overlay__content) {
    border-radius: 0;
    margin: 0;
    background-color: rgb(var(--v-theme-background));
}


.mobile-nav-bar {
    margin: 10px 0 30px;
}

.main-wrapper {
    padding: 30px 0;
    margin-top: 0 !important;
    display: grid;
    grid-template-columns: 10fr 103fr 10fr;
    align-items: start;
    width: 100%;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
        display: flex;
        padding: unset;
        padding-top: 0;
        margin-top: 0;
    }

    .result-components {
        grid-column-start: 2;
        padding: 0 2em;

        display: flex;
        flex-direction: column;

        @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
            width: 100%;
            padding: 0 0.5em;
        }

        .info {
            display: flex;
            align-content: center;

            @media #{ map-get(settings.$display-breakpoints, 'sm-and-up')} {
                justify-content: flex-start;
            }

            svg {
                max-width: 45px !important;
            }

            .sep {
                height: 40px;
                margin-right: 1rem;

                hr {
                    border-color: rgb(var(--v-theme-primary));
                    opacity: 1;
                    border-width: 0 1.5px 0 0;
                }
            }


            .nom-card {
                display: inline-flex;
                justify-content: space-between;

                a {
                    display: flex;
                    align-items: center;
                    justify-items: center;
                }

                .nomprenom {
                    color: rgb(var(--v-theme-orange-abes));
                    font-size: 28px;
                    font-weight: 500;
                    padding-left: 10px;
                }
            }

        }

        .theses {
            padding: 1em 0;

            .role-expansion-panel-wrapper {
                display: flex;
                flex-direction: column;
            }

            :deep(.v-expansion-panel-title--active) {
                position: sticky;
                top: 0;
                z-index: 2;
                background-color: rgb(var(--v-theme-surface));
                border-bottom: 1px solid rgb(var(--v-theme-orange-abes));
            }

            .role-expansion-panel {
                border-top: 2px solid rgb(var(--v-theme-gris-fonce));

                h3 {
                    padding: 0.5em 0 0.5em;
                    font-size: 26px;
                }
            }

            :deep(.v-expansion-panel-text__wrapper) {
                @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
                    padding-left: 5px;
                    padding-right: 5px;
                }
            }

            :deep(.v-card-title) {
                padding-left: 0;
                padding-right: 0;
            }


            .v-expansion-panel :deep(.v-expansion-panel__shadow) {
                box-shadow: none;
            }

            .v-expansion-panel-title--active :deep(.v-expansion-panel-title__overlay) {
                opacity: 0;
            }

            .card-wrapper {
                margin-bottom: 1rem;
            }
        }

        .thesis-component {
            margin: 2em auto 20px;
        }

    }
}

.info-wrapper {
    padding-top: 1em;
}

.skeleton-cards {
    height: 150px !important;
    background-color: rgb(var(--v-theme-gris-clair));
    margin: 1em 0;
}

.skeleton {
    margin-bottom: 3em;
}

.skeleton-wrapper {
    padding: 2em 0;
}

:deep(.v-skeleton-loader__button) {
    max-width: unset !important;
    width: 250px;
}

.loadMoreButton {
    display: flex;
    justify-content: center;
}

.domain-selector {
    :deep(.v-btn__content) {
        flex-direction: row !important;
    }

    :deep(.v-icon) {
        margin-right: 1rem !important;
    }
}
</style>