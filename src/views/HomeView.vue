<template>
  <v-container>
    <RouterLink class="logo" :to="{ name: 'home' }">
      <img alt="Logo du site theses.fr" id="logoIMG" src="@/assets/icone-theses.svg" />
    </RouterLink>
    <div class="main-wrapper">
      <Message-box ref="messageBox"></Message-box>
      <v-row class="justify-center">
        <h1 class="pb-8 text-center">{{ $t("slogan") }}</h1>
      </v-row>
      <domain-selector></domain-selector>
      <search-bar @search="loading = true" :loading="loading" @onError="displayError" />
      <div class="stats">
        <Stats-card :titre=nbTheses :description="$t('referencés')" badge="mdi-check" badgecolor="green"
          url="/resultats?filtres=%255BStatut%253D%2522soutenue%2522%255D&q=*&page=1&nb=10&tri=dateDesc&domaine=theses"></Stats-card>
        <Stats-card :titre=nbSujets :description="$t('preparation')" badge="mdi-progress-clock" badgecolor="orange"
          url="/resultats?filtres=%255BStatut%253D%2522enCours%2522%255D&q=*&page=1&nb=10&tri=dateDesc&domaine=theses"></Stats-card>
        <Stats-card :titre=nbPersonnes :description="$t('personnesRef')" icon="mdi-account"
          url="/resultats?q=*&page=1&nb=10&tri=PersonnesAsc&domaine=personnes"></Stats-card>
      </div>
      <p>Le PoC fédé est accessible ici : <a href="/poc-fede/">poc-fede</a></p>
    </div>
  </v-container>
</template>

<script setup>
import SearchBar from '../components/generic/GenericSearchBar.vue';
import StatsCard from '../components/home/StatsCard.vue';
import DomainSelector from '../components/common/DomainSelector.vue';
import { defineAsyncComponent, onMounted, ref } from "vue";
import { APIService } from "@/services/StrategyAPI";
import { thesesAPIService } from "@/services/ThesesAPI";
import { personnesAPIService } from "@/services/PersonnesAPI";


const MessageBox = defineAsyncComponent(() => import('@/components/common/MessageBox.vue'));
const { reinitializeResultData } = APIService();
const { getStatsTheses, getStatsSujets } = thesesAPIService();
const { getStatsPersonnes } = personnesAPIService();

let loading = ref(false);

const messageBox = ref(null);

const nbPersonnes = ref(0), nbTheses = ref(0), nbSujets = ref(0);

onMounted(() => {
  // réinitialiser les éléments liés à la recherche au retour à la page d'accueil
  reinitializeResultData();
  getStatsTheses().then(result => {
    nbTheses.value = result.data;
  });
  getStatsSujets().then(result => {
    nbSujets.value = result.data;
  });
  getStatsPersonnes().then(result => {
    nbPersonnes.value = result.data;
  });
});

function displayError(message) {
  messageBox.value?.open(message, {
    type: "error"
  });
}

</script>

<style scoped lang="scss">
@use 'vuetify/settings';

//Container pour afficher l'image de fond
.v-container {
  padding: 0;
  max-width: none;
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

    @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
      font-size: 43px;
      line-height: 50px;
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
    height: 100%;
    padding-top: 40px;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-up')} {
      flex-direction: row;
    }

    .v-card {
      width: 100%;
    }

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-up')} {
      .v-card {
        flex: 1 0 30%;
        max-width: 30%;
      }
    }
  }

  p {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    margin-bottom: 2rem;
  }
}
</style>