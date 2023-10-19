<template>
    <ClientOnly>
        <Message-box ref="messageBox"></Message-box>

        <nav v-if="mobile" class="mobile-nav-bar">
            <div>
                <v-icon @click="showSearchBar = !showSearchBar" size="40px"
                    :class="{ 'magnify-logo-active': showSearchBar }">mdi-magnify
                </v-icon>
                <v-tooltip activator="parent" location="start">{{ $t('rechercher') }}</v-tooltip>
            </div>
        </nav>

        <!--  Mobile-->

        <div v-if="mobile" class="logo-menu-wrapper">
            <NuxtLink :to="{ name: 'index', query: { domaine: 'theses' } }" title="Accueil du site"
                class="logo logo_resultview">
                <img alt="logo Theses" id="logoIMG" src="@/assets/icone-theses.svg" />
            </NuxtLink>
            <v-expand-transition>
                <div v-show="showSearchBar" class="expanded-search-bar-container white-containers">
                    <div class="expanded-search-bar">
                        <CommonDomainSelector></CommonDomainSelector>
                        <GenericSearchBar />
                    </div>
                </div>
            </v-expand-transition>
        </div>
    </ClientOnly>

    <!--  Desktop-->
    <div v-if="!mobile" class="sub-header">
        <div class="search-bar-container white-containers">
            <div class="sub_header__logo">
                <NuxtLink :to="{ name: 'index', query: { domaine: 'theses' } }" title="Accueil du site">
                    <img class="logo" alt="logo Theses" id="logoIMG" src="@/assets/icone-theses.svg" />
                </NuxtLink>
                <h1>{{ $t("slogan") }}</h1>
            </div>
            <div class="sub_header__action">
                <CommonDomainSelector compact></CommonDomainSelector>
                <GenericSearchBar />
            </div>
        </div>
    </div>

    <div class="main-wrapper">
        <div class="result-components white-containers">
            <!--   Skeletton-->
            <div v-if="!dataReady" class="skeleton-wrapper">
                <v-skeleton-loader type="list-item-avatar-two-line" class="skeleton"></v-skeleton-loader>
                <v-skeleton-loader type="divider" class="skeleton"></v-skeleton-loader>
                <v-skeleton-loader v-for="i in 4" :key="i" type="paragraph" class="skeleton-cards"></v-skeleton-loader>
            </div>
            <!--      End skeletton-->
            <div class="info-wrapper" v-else>
                <div class="info">
                    <div class="nom-card">
                        <div class="nomprenom">
                            {{ name }}
                        </div>
                    </div>
                </div>
                <!--        Tiroirs thèses-->
                <div class="theses">
                    <v-expansion-panels multiple class="role-expansion-panel-wrapper">
                        <template
                            v-for="key in ['etabSoutenance', 'etabSoutenanceEnCours', 'partenaireRecherche', 'partenaireRechercheEnCours', 'etabCotutelle', 'etabCotutelleEnCours', 'ecoleDoctorale', 'ecoleDoctoraleEnCours']"
                            :key="key">
                            <div v-if="item[key] && item[key].length > 0" class="role-expansion-panel">
                                <v-expansion-panel>
                                    <v-expansion-panel-title>
                                        <template v-slot:actions="{ expanded }">
                                            <v-icon :icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'" size="x-large">
                                            </v-icon>
                                        </template>
                                        <h2>
                                            {{ $t("organismeView." + key, [item[key].length]) }}

                                        </h2>
                                    </v-expansion-panel-title>
                                    <v-expansion-panel-text>
                                        <div v-for="(these, index) in item[key]" :key="these" class="card-wrapper">
                                            <v-lazy :options="{ threshold: 1.0 }">

                                                <ResultCard :titre="these.titrePrincipal"
                                                    :date="these.status === 'enCours' ? these.datePremiereInscriptionDoctorat : these.dateSoutenance"
                                                    :auteur="these.auteurs" :directeurs="these.directeurs"
                                                    :discipline="these.discipline" :etab="these.etabSoutenanceN"
                                                    :id="these.id" :status="these.status">
                                                </ResultCard>
                                            </v-lazy>
                                            <hr class="result-dividers" v-if="index < item[key].length - 1" />
                                        </div>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                            </div>
                        </template>
                    </v-expansion-panels>
                </div>
            </div>
        </div>
        <ClientOnly>
            <ScrollToTopButton class="scroll-to-top-wrapper" :nb-result=1></ScrollToTopButton>
        </ClientOnly>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { ref, defineAsyncComponent } from "vue";
import { useDisplay } from "vuetify";
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader';
import ResultCard from "../theses/results/ResultCard.vue";
import ScrollToTopButton from "../common/ScrollToTopButton.vue";

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
const showSearchBar = ref(false);

dataReady.value = false;
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
        ogImage: "https://beta.theses.fr/icone-theses-beta.svg",
        ogImageAlt: 'Logo Theses.fr',
        twitterCard: 'summary_large_image',
    })
}).catch(error => {
    if (error.response) {
        displayError(error.response.data.message, { isSticky: true });
    } else {
        displayError(error.message);
    }
});


const messageBox = ref(null);

function displayError(message, opt) {
    messageBox.value?.open(message, {
        ...opt,
        type: "error"
    });
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
    display: grid;
    grid-template-columns: 10fr 103fr 10fr;
    align-items: start;
    margin-top: 0;
    width: 100%;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
        display: flex;
    }

    .result-components {
        grid-column-start: 2;
        padding: 0 2em;

        @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
            width: 100%;
        }

        .info {
            display: flex;
            align-content: center;

            @media #{ map-get(settings.$display-breakpoints, 'sm-and-up')} {
                justify-content: flex-start;
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

                .nomprenom {
                    color: rgb(var(--v-theme-orange-abes));

                    a {
                        display: flex;
                        align-items: center;

                        img {
                            margin: 0 0.3em !important;
                        }
                    }
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

                h2 {
                    padding: 0.5em 0 0.5em;
                    font-size: 26px;
                }
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

.domain-selector {
    :deep(.v-btn__content) {
        flex-direction: row !important;
    }

    :deep(.v-icon) {
        margin-right: 1rem !important;
    }
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
</style>