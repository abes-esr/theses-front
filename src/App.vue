<template>
  <metainfo>
    <template v-slot:title="{ content }">{{ content }} | Theses.fr</template>
  </metainfo>
  <v-app>
    <!-- DEBUT BLOC BETA-->
    <v-alert width="100%" outlined color="primary"
      style="padding-top: 30px; padding-bottom: 30px;"><strong>Avertissement</strong> : vous êtes
      sur la version beta de
      Theses.fr. Cette
      version bêta est incomplète. <a href="https://theses.fr/"><strong style="color: white;">Cliquez ici pour retourner à
          la version actuelle.
        </strong></a><v-btn class="float-right" tonal color="secondary" @click="dialog = true">Plus
        d'informations</v-btn></v-alert>
    <!-- FIN BLOC BETA-->
    <header-custom></header-custom>
    <v-main>
      <!-- DEBUT BLOC BETA-->
      <v-dialog v-model="dialog" width="auto">
        <v-card>
          <v-card-text style="font-size: 1.2rem; letter-spacing: normal;">
            <strong>Avertissement :</strong><br /><br />
            Une nouvelle version de theses.fr est en cours de développement. Nous vous proposons ici la version bêta de ce
            nouveau moteur de recherche. Cette version bêta est incomplète. Toutes les fonctionnalités n’ont pas encore
            été développées, le design est appelé à évoluer et tous les bugs ne sont pas encore corrigés. Cette version
            bêta évoluera au fil des nouvelles livraisons, jusqu’au passage en production officiel du nouveau theses.fr,
            prévu pour 2024.<br /><br />
            Les données qui figurent sur ce theses.fr bêta sont les mêmes que celles qui figurent sur theses.fr v1, avec
            néanmoins un temps de mise à jour plus long, la réindexation automatique des données n’étant pas encore mise
            en place sur la version bêta. Toutes les demandes relatives à ces données (ajouts, corrections, suppressions)
            doivent nous être adressées à partir du site officiel, theses.fr v1, et non à partir de la version bêta.
            <br /><br />
            <strong>Cliquez ici pour retourner à la version actuelle : </strong><a
              href="https://theses.fr/">https://theses.fr/</a>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" block flat @click="setDialogSeen">Fermer</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- FIN BLOC BETA-->
      <router-view />
    </v-main>
    <footer-custom></footer-custom>
  </v-app>
</template>

<script>
import HeaderCustom from "@/components/common/HeaderCustom.vue";
import FooterCustom from "./components/common/FooterCustom.vue";
import { useMeta } from 'vue-meta';
import { ref } from 'vue';
import { useI18n } from "vue-i18n";


export default {
  components: {
    HeaderCustom,
    FooterCustom
  },
  name: 'App',
  setup() {
    const { t } = useI18n();
    useMeta({
      title: t("meta.titre"),
      description: t("meta.desc")
    });



    // DEBUT BETA
    const dialog = ref(false);
    if (!localStorage.getItem('hasSeenWarning')) dialog.value = true;

    function setDialogSeen() {
      dialog.value = false;
      localStorage.setItem('hasSeenWarning', true);
    }
    // FIN BETA

    return {
      dialog,
      setDialogSeen
    };
  },
  data: () => ({
    //
  }),
};
</script>

<style lang="scss">
@use 'vuetify/settings';

.v-application__wrap {
  justify-content: center;
  align-items: center;
}

main {
  display: flex !important;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100vw;

  padding-top: 0 !important;
  color: rgb(var(--v-theme-text-dark-blue)) !important;

  nav {
    background-color: rgb(var(--v-theme-gris-clair));
    width: 100vw;
  }

  .nav-bar {
    height: 100%;
    width: 100%;
    max-width: 20vw;
    border-right: 3px solid rgb(var(--v-theme-text-dark-blue));
  }

  .mobile-nav-bar {
    display: flex;
    justify-content: space-between;
    align-content: center;
    padding: 0 10px;
  }

  .filter-mobile-nav-bar {
    display: flex;
    align-content: center;

    span {
      padding: 10% 0;
    }
  }

  .logo {
    position: relative;
    z-index: 2000;

    grid-column-start: 2;
    justify-self: center;
    grid-row-start: 1;
    align-self: start;

    img {
      height: 70px;

      @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
        height: 150px;
      }
    }
  }

  .logo_home {
    margin-top: -35px;

    @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
      margin-top: -75px;
      align-self: center;
    }
  }

  .logo-menu-wrapper {
    width: 100%;
    display: grid;
    grid-template-columns: 33% 33% 33%;
    grid-template-rows: 33% 33% 33%;
  }

  .logo-menu-wrapper>.expanded-search-bar-container {
    margin-bottom: 40px;
  }

  .magnify-logo-active {
    color: rgb(var(--v-theme-orange-abes));
  }

  .expanded-search-bar-container {
    width: 100%;
    grid-column: 1 / 5;
    justify-self: center;
    grid-row-start: 1;
    align-self: start;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgb(var(--v-theme-gris-clair));
    border-bottom: 1px solid #bbb;
    border-top: 1px solid #bbb;
  }

  .expanded-search-bar {
    width: 80%;
  }

  .main-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    height: 100%;
  }
}

.full-screen {
  width: 100%;
  height: 100%;
  overflow: scroll;
  background-color: rgb(var(--v-theme-surface));
  padding: 1rem;

  h4 {
    width: 100%;
    background-color: rgb(var(--v-theme-gris-clair));
    text-align: center;
  }
}

.v-card {
  color: rgb(var(--v-theme-text-dark-blue)) !important;
}

h1 {
  color: rgb(var(--v-theme-primary));
}

h2 {
  color: rgb(var(--v-theme-primary));
}

h3 {
  color: rgb(var(--v-theme-primary));
  font-size: 15px;
  font-family: "Roboto-Bold", sans-serif;
  font-weight: 700;
}

h4 {
  color: rgb(var(--v-theme-primary));
  font-size: 1.2rem;
}

.clickable {
  cursor: pointer;
}

.no-wrap-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.scroll-to-top-wrapper {
  position: sticky;
  top: 90vh;
  margin-bottom: 3rem;
  margin-left: 10%;
  width: 30px;
  height: 30px;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    margin: 0 0;
    height: 60px;
    left: 90vw;
    top: unset;
    bottom: 5vh;
  }
}
</style>
<style scoped lang="scss">
@use 'vuetify/settings';
</style>