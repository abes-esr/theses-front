<template>
  <Message-box ref="messageBox"></Message-box>
  <nav>
    <v-menu v-if="mobile" :model-value="openMenu" :close-on-content-click="false" content-class="full-screen"
            location-strategy="static">
      <template v-slot:activator="{ props }">
        <v-icon v-bind="props" size="40px" @click="openMenu = !openMenu">mdi-menu
        </v-icon>
      </template>
      <div class="statistique__title">
        <v-icon size="40px">mdi-account</v-icon>
        <v-btn size=40px icon="mdi-close-box" color="red" variant="text" @click="openMenu = !openMenu"></v-btn>
      </div>
      <div class="statistique__content">
        <statistique-card-personne :stats="item.roles"></statistique-card-personne>
      </div>
    </v-menu>
  </nav>
  <RouterLink class="logo" :to="{ name: 'home' }" v-if="mobile">
    <img alt="logo" id="logoIMG" src="@/assets/icone-theses.svg"/>
  </RouterLink>
  <div v-else class="sub-header">
    <div class="left-side sub_header__logo">
      <RouterLink :to="{ name: 'home' }">
        <img class="logo" alt="logo" id="logoIMG" src="@/assets/icone-theses.svg"/>
      </RouterLink>
      <h1>{{ $t("slogan") }}</h1>
    </div>
    <div class="sub_header__action">
      <domain-selector compact></domain-selector>
      <search-bar @search="loading = true" :loading="loading" @onError="displayError"/>
    </div>
  </div>
  <div v-if="!mobile" class="search-filter">
    <div class="left-side statistique__title">
      <v-icon size="40px">mdi-account</v-icon>
    </div>
    <action-bar-personnes></action-bar-personnes>
  </div>
  <div class="main-wrapper">
    <div class="left-side nav-bar statistique__content" v-if="!mobile">
      <statistique-card-personne :stats="item.roles"></statistique-card-personne>
    </div>
    <div class="result-components">
      <v-card-text v-if="!dataReady">
        <v-container fluid fill-height>
          <v-layout justify-center align-center>
            <v-progress-circular indeterminate color="rgb(var(--v-theme-primary))">
            </v-progress-circular>
          </v-layout>
        </v-container>
      </v-card-text>
      <div v-if="dataReady">
        <div class="info">
          <div class="nom-card">
            <v-icon size="45px">$personne</v-icon>
            <div class="nomprenom">
              <span class="prenom">{{ item.prenom }}</span>
              <span class="nom">{{ item.nom }}</span>
            </div>
          </div>
          <v-divider vertical></v-divider>
          <a v-if="item.has_idref" :href="`https://www.idref.fr/${item.id}`" target="_blank">
            <img alt="logo" id="logoIMG" src="@/assets/idref-icone.png"/>
          </a>
        </div>
        <personne-motcles :motsCles="item.mots_cles"/>
        <div class="theses">
          <div v-if="item.theses['auteur'] && item.theses['auteur'].length > 0">
            <hr/>
            <h2 id="Auteurs">{{ $t("personnes.personneView.roles.auteur", [item.theses['auteur'].length]) }}</h2>
            <div v-for="these in item.theses['auteur']" :key="`auteur-${these.nnt}`" class="card-wrapper">
              <result-card :titre="these.titre"
                           :date="new Date(these.date_soutenance).toLocaleDateString('en-GB')"
                           :auteur="these.auteurs" :directeurs="these.directeurs" :discipline="these.discipline"
                           :etab="these.etablissement_soutenance.nom"
                           :id="these.nnt" :status="these.status">
              </result-card>
            </div>
          </div>

          <div v-if="item.theses['directeur de thèse'] && item.theses['directeur de thèse'].length > 0">
            <hr/>
            <h2 id="Directeurs">
              {{ $t("personnes.personneView.roles.directeur", [item.theses['directeur de thèse'].length]) }}</h2>
            <div v-for="these in item.theses['directeur de thèse']" :key="`directeur-${these.nnt}`"
                 class="card-wrapper">
              <result-card :titre="these.titre"
                           :date="new Date(these.date_soutenance).toLocaleDateString('en-GB')"
                           :auteur="these.auteurs" :directeurs="these.directeurs" :discipline="these.discipline"
                           :etab="these.etablissement_soutenance.nom"
                           :id="these.nnt" :status="these.status">
              </result-card>
            </div>
          </div>

          <div v-if="item.theses['rapporteur'] && item.theses['rapporteur'].length > 0">
            <hr/>
            <h2 id="Rapporteurs">{{
                $t("personnes.personneView.roles.rapporteur", [item.theses['rapporteur'].length])
              }}</h2>
            <div v-for="these in item.theses['rapporteur']" :key="`rapporteur-${these.nnt}`" class="card-wrapper">
              <result-card :titre="these.titre"
                           :date="new Date(these.date_soutenance).toLocaleDateString('en-GB')"
                           :auteur="these.auteurs" :directeurs="these.directeurs" :discipline="these.discipline"
                           :etab="these.etablissement_soutenance.nom"
                           :id="these.nnt" :status="these.status">
              </result-card>
            </div>
          </div>

          <div v-if="item.theses['président du jury'] && item.theses['président du jury'].length > 0">
            <hr/>
            <h2>{{ $t("personnes.personneView.roles.president", [item.theses['président du jury'].length]) }}</h2>
            <div v-for="these in item.theses['président du jury']" :key="`president-${these.nnt}`" class="card-wrapper">
              <result-card :titre="these.titre"
                           :date="new Date(these.date_soutenance).toLocaleDateString('en-GB')"
                           :auteur="these.auteurs" :directeurs="these.directeurs" :discipline="these.discipline"
                           :etab="these.etablissement_soutenance.nom"
                           :id="these.nnt" :status="these.status">
              </result-card>
            </div>
          </div>

          <div v-if="item.theses['membre du jury'] && item.theses['membre du jury'].length > 0">
            <hr/>
            <h2>{{ $t("personnes.personneView.roles.membre", [item.theses['membre du jury'].length]) }}</h2>
            <div v-for="these in item.theses['membre du jury']" :key="`membre-${these.nnt}`" class="card-wrapper">
              <result-card :titre="these.titre"
                           :date="new Date(these.date_soutenance).toLocaleDateString('en-GB')"
                           :auteur="these.auteurs" :directeurs="these.directeurs" :discipline="these.discipline"
                           :etab="these.etablissement_soutenance.nom"
                           :id="these.nnt" :status="these.status">
              </result-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="scroll-to-top-container">
    <scroll-to-top-button class="scroll-to-top-wrapper" :nb-result=1></scroll-to-top-button>
  </div>
</template>

<script setup>
import {useMeta} from 'vue-meta';
import {useI18n} from "vue-i18n";

import {defineAsyncComponent, onBeforeMount, onUpdated, ref, watchEffect} from 'vue';
import SearchBar from '../components/generic/GenericSearchBar.vue';
import DomainSelector from '@/components/common/DomainSelector.vue';

import {personnesAPIService} from "@/services/PersonnesAPI";
import {useDisplay} from "vuetify";
import ActionBarPersonnes from "@/components/personnes/ActionBar.vue";
import StatistiqueCardPersonne from "@/components/personnes/StatistiqueCard.vue";
import ResultCard from "@/components/theses/results/ResultCard.vue";
import ScrollToTopButton from "@/components/common/ScrollToTopButton.vue";
import PersonneMotcles from "@/components/personnes/MotsCles.vue";
import {useRoute} from "vue-router";

const {mobile} = useDisplay();
const MessageBox = defineAsyncComponent(() => import('@/components/common/MessageBox.vue'));
const {getPersonne} = personnesAPIService();
const currentRoute = useRoute();

const loading = ref(false);
const dataReady = ref(false);
const openMenu = ref(false);
const hasScrolled = ref(false);
const item = ref({});

const {t} = useI18n();
const {meta} = useMeta({});

watchEffect(() => {
  const titlePersonne = item.value.prenom ? item.value.prenom + item.value.nom : "";
  meta.title = titlePersonne;
  meta.description = t("meta.descPersonne") + titlePersonne;
});

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

onBeforeMount(() => {
  dataReady.value = false;
  getPersonne(props.id).then(result => {
    item.value = result;
    dataReady.value = true;
  }).catch(error => {
    if (error.response) {
      displayError(error.response.data.message, {isSticky: true});
    } else {
      displayError(error.message);
    }
  });
});

onUpdated(() => {
  if (currentRoute.hash) {
    document.getElementById(currentRoute.hash.substring(1))?.scrollIntoView({behavior: "smooth"});
  }
})

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

.greyBar {
  background-color: rgb(var(--v-theme-gris-clair)) !important;
}

.darkGreyBar {
  background-color: rgb(var(--v-theme-gris-fonce)) !important;
}

.blueBorder {
  border-right: solid rgb(var(--v-theme-primary)) 3px;
}

.logo {
  margin-top: -55px;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-up')} {
    margin-top: -110px;
  }
}

.v-menu ::v-deep(.v-overlay__content) {
  border-radius: 0;
  margin: 0;
  background-color: rgb(var(--v-theme-background));
}

.left-side {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1 0 100%;
  max-width: 20vw;
  height: 100%;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    max-width: 100%;
    flex: 0 1 auto;
    padding: 0;
  }
}

.sub-header {
  display: flex;
  flex-direction: row;
  width: 100%;

  .sub_header__logo {
    background-color: rgb(var(--v-theme-surface));
    z-index: 2;

    h1 {
      text-align: center;
      width: 80%;
      font-weight: 300;
      font-size: 16px;
    }

    .logo {
      margin-top: 0;
    }
  }

  .sub_header__action {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1 0 auto;

    .domain-selector,
    .searchbar {
      width: 70%;
    }

    .domain-selector {
      :deep(.v-btn__content) {
        flex-direction: row;
      }

      :deep(.v-icon) {
        margin-right: 1rem;
      }
    }
  }
}

.statistique__title {
  align-items: flex-start;
  background-color: rgb(var(--v-theme-gris-clair));
  padding-left: 1rem;
  display: flex;
  justify-content: space-between;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
    border-right: 3px solid rgb(var(--v-theme-text-dark-blue));
  }
}

.statistique__content {
  align-items: flex-start;
  justify-content: flex-start;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
    border-right: 3px solid rgb(var(--v-theme-text-dark-blue));
  }

  ::v-deep(ul) {
    margin-left: 1rem;
  }
}

.search-filter {
  display: flex;
  flex-direction: row;
  width: 100%;

  h4 {
    background-color: rgb(var(--v-theme-gris-clair));
  }
}


.main-wrapper {
  flex-direction: row;
  align-items: flex-start;
  margin-top: 0;
  width: 100%;

  .result-components {
    width: 100%;
    margin-right: 1rem;
    margin-left: 1rem;
    margin-bottom: 2rem;

    .info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 1rem;
      width: calc(100% - 2rem);

      @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
        width: calc(30% - 2rem);
      }

      .nom-card {
        display: flex;
        align-items: center;

        .v-icon {
          margin-right: 1rem;
        }

        .nomprenom {
          text-decoration: none;
          color: rgb(var(--v-theme-orange-abes));
          font-size: 23.5px;

          @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
            font-size: 29.5px;
          }

          .prenom {
            font-weight: 400;
          }

          .nom {
            margin-left: 0.5rem;
            font-weight: 700;
          }
        }
      }

      hr {
        border-color: rgb(var(--v-theme-primary));
        opacity: 1;
        border-width: 0 1.5px 0 0;
      }

      a {
        img {
          max-height: 30px;
        }
      }
    }

    .theses {

      h2 {
        margin-bottom: 1rem;
      }

      hr {
        margin: 1rem 0 2rem 0;
      }

      .card-wrapper {
        margin-bottom: 1rem;
      }
    }

  }
}

.colonnes-resultats {
  padding: 0;
}

.result-components-wrapper {
  display: grid;
}

.scroll-to-top-container {
  position: absolute;
  left: 95.5%;
  top: 30%;
  width: 5%;
  bottom: 260px;

  @media #{ map-get(settings.$display-breakpoints, 'xl-and-up')} {
    left: 96%;
  }
  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    left: 95%;
    bottom: 730px;
  }

  @media #{ map-get(settings.$display-breakpoints, 'xs')} {
    left: 90%;
    bottom: 800px;
  }
}

.scroll-to-top-wrapper {
  margin-left: 25px;
  margin-bottom: 0;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    margin: 0 0;
    height: 60px;
    top: 90vh !important;
  }
}
</style>