<template>
  <RouterLink class="logo" :to="{ name: 'home' }">
    <img alt="Logo du site theses.fr" id="logoIMG" src="@/assets/icone-theses.svg" />
  </RouterLink>
  <div class="main-wrapper">
    <Message-box ref="messageBox"></Message-box>
    <v-row class="justify-center">
      <h1 class="pb-16 text-center">{{ $t("slogan") }}</h1>
    </v-row>
    <domain-selector></domain-selector>
    <search-bar @search="loading = true" :loading="loading" @onError="displayError" />
    <div class="stats">
      <Stats-card titre="546 000" :description="$t('referencés')" date="au 03/06/2022"></Stats-card>
      <Stats-card titre="79 000" :description="$t('preparation')" date="au 03/06/2022"></Stats-card>
      <Stats-card titre="805 000" :description="$t('personnesRef')" date="au 03/06/2022"></Stats-card>
    </div>
    <p>Le PoC fédé est accessible ici : <a href="/poc-fede/">poc-fede</a></p>
  </div>
</template>

<script setup>
import SearchBar from '../components/generic/GenericSearchBar.vue';
import StatsCard from '../components/home/StatsCard.vue';
import DomainSelector from '../components/common/DomainSelector.vue';
import { defineAsyncComponent, ref } from "vue";

const MessageBox = defineAsyncComponent(() => import('@/components/common/MessageBox.vue'));

let loading = ref(false);

const messageBox = ref(null);

function displayError(message) {
  messageBox.value?.open(message, {
    type: "error"
  });
}

</script>

<style scoped lang="scss">
@use 'vuetify/settings';

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
      line-height: 28px;
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