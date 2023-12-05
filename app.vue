<template>
  <v-app>
    <ClientOnly>
      <!-- DEBUT BLOC BETA-->
      <v-alert class="beta-alert" width="100%" outlined color="primary"
        style="padding-top: 30px; padding-bottom: 30px;"><strong>Avertissement</strong> : vous êtes
        sur la version beta de
        Theses.fr. Cette
        version bêta est incomplète. <a href="https://theses.fr/"><strong style="color: white;">Cliquez ici pour retourner
            à
            la version actuelle.
          </strong></a><v-btn style="margin-top: 10px;" class="float-right" density="compact" tonal color="secondary"
          @click="dialog = true">Plus
          d'informations</v-btn></v-alert>
      <!-- FIN BLOC BETA-->
    </ClientOnly>
    <CommonHeaderCustom></CommonHeaderCustom>
    <v-main>
      <ClientOnly>
        <!-- DEBUT BLOC BETA-->
        <v-dialog v-model="dialog" width="auto">
          <v-card>
            <v-card-text style="font-size: 1.2rem; letter-spacing: normal;">
              <strong>Avertissement :</strong><br /><br />
              Une nouvelle version de theses.fr est en cours de développement. Nous vous proposons ici la version bêta de
              ce
              nouveau moteur de recherche. Cette version bêta est incomplète. Toutes les fonctionnalités n’ont pas encore
              été développées, le design est appelé à évoluer et tous les bugs ne sont pas encore corrigés. Cette version
              bêta évoluera au fil des nouvelles livraisons, jusqu’au passage en production officiel du nouveau theses.fr,
              prévu pour 2024.<br /><br />
              Les données qui figurent sur ce theses.fr bêta sont les mêmes que celles qui figurent sur theses.fr v1, avec
              néanmoins un temps de mise à jour plus long, la réindexation automatique des données n’étant pas encore mise
              en place sur la version bêta. Toutes les demandes relatives à ces données (ajouts, corrections,
              suppressions)
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
      </ClientOnly>
      <NuxtPage></NuxtPage>
    </v-main>
    <CommonFooterCustom></CommonFooterCustom>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';

// DEBUT BETA
const dialog = ref(false);
if (process.client) {
  if (!localStorage.getItem('hasSeenWarning')) dialog.value = true;
}

function setDialogSeen() {
  dialog.value = false;
  localStorage.setItem('hasSeenWarning', true);
}
// FIN BETA

useHead({
  title: "Theses.fr",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  charset: "utf-8",
  meta: [{ name: "description", content: "Moteur de recherche des thèses françaises, theses.fr propose l’accès aux thèses de doctorat soutenues ou en préparation." }],
  script: [
    {
      async: true,
      src: "https://abes-esr.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-ia3qmx/b/4/c95134bc67d3a521bb3f4331beb9b804/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=fr-FR&collectorId=1a71caf6"
    }
  ],
});

</script>

<style lang="scss">
@use 'vuetify/settings';

//TODO : A SUPPRIMER APRES BETA
.beta-alert {
  max-height: 80px;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    max-height: 500px;
  }
}

.v-application__wrap {
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column !important;
}

main {
  display: flex !important;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  height: 100%;
  flex: 1 1 auto !important;


  padding-top: 0 !important;
  color: rgb(var(--v-theme-text-dark-blue)) !important;

  nav {
    width: 100vw;
  }

  .nav-bar {
    grid-column-start: 2;
    background-color: rgb(var(--v-theme-surface));
    border: solid 1px rgb(var(--v-theme-gris-clair));
    padding-bottom: 1em;
  }

  .mobile-nav-bar {
    display: flex;
    justify-content: space-between;
    align-content: center;
    padding: 0 10px;
    margin: 0 0 30px;
    border-bottom: solid 1px rgb(var(--v-theme-gris-clair));

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
      margin: 0 0 30px;
    }
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
        height: 130px;
      }
    }
  }

  .logo_home {
    margin-top: -45px;

    @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
      margin-top: -75px;
      align-self: center;
    }
  }

  .logo_resultview {
    margin-top: -100px;
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

  .logo-active {
    color: rgb(var(--v-theme-orange-abes));
  }

  .expanded-search-bar-container {
    margin-top: -30px;
    width: 100%;
    grid-column: 1 / 5;
    justify-self: center;
    grid-row-start: 1;
    align-self: start;
    display: flex;
    flex-direction: column;
    align-items: center;
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
    margin-top: 1rem;
    height: 100%;
  }
}

.menu-burger-header {
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 10%;
  padding-right: 2%;
  width: 100%;
  min-height: 4rem;
  font-size: 22px;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
    padding-left: 7%;
    padding-right: 2%;
    font-size: 20px;
  }

  .menu-meta {
    display: flex;
    justify-content: space-between;
    min-width: 4.5em;
  }
}

.expanded-burger-menu {
  padding-bottom: 15px;

  .nav-bar-list-burger {
    padding: 0 2em;
    display: flex;
    flex-direction: column;

    .menu-text-element {
      color: rgb(var(--v-theme-primary));
      font-size: 20px;
      font-family: "Roboto-Bold", sans-serif;
      font-weight: 500;

      a {
        text-decoration: none;
      }
    }
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
  z-index: 1000;
  position: sticky;
  top: 90vh;
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

.search-bar-container {
  grid-column-start: 2;
  margin-top: 30px;

  display: grid;
  grid-template-columns: 20fr 3fr 80fr;
}

.sub-header {
  width: 100%;
  display: grid;
  grid-template-columns: 10fr 103fr 10fr;

  .sub_header__logo {
    grid-column-start: 1;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
      text-align: center;
      width: 80%;
      font-weight: 300;
      font-size: 14px;
    }

    .logo {
      margin-top: 0;
      height: 115px;
    }
  }

  .sub_header__action {
    grid-column-start: 3;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1 0 auto;

    .domain-selector,
    .searchbar {
      width: 90%;
    }
  }
}

.v-overlay :deep(.v-overlay__content) {
  padding: 0 0;
  background-color: rgb(var(--v-theme-background));
}

.white-containers {
  background-color: rgb(var(--v-theme-surface));
  border: solid 1px rgb(var(--v-theme-gris-clair));
}

.nom-card {
  flex: 1 0 100%;
  display: flex;
  align-items: center;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
    flex: 1 0 60%;
  }

  .nomprenom {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    text-decoration: none;
    color: rgb(var(--v-theme-primary));
    font-size: 20px;

    .prenom {
      font-weight: 400;
    }

    .nom {
      font-weight: 700;
    }
  }

  #logoIdref {
    margin: 0 0.6em;
    height: 2.5em;
  }
}

.result-dividers {
  border: 1px solid rgb(var(--v-theme-gris-clair));
  margin: 0 1rem;
}

.grecaptcha-badge {
  visibility: hidden;
}

.rtl-text {
  direction: rtl !important;
}

.grecaptcha-badge {
  visibility: hidden;
}

.close-overlay-button {
  width: 35px;
  height: 35px;
  position: relative;
}

.circle {
  border-radius: 50%;
  width: 25px;
  height: 25px;
  position: absolute;
  top: 5px;
  left: 5px;
  background: rgb(var(--v-theme-surface));
}

.close-icon {
  color: rgb(var(--v-theme-orange-abes));
  position: absolute;
  top: 0;
  left: 0;
}

.disabled-link {
  pointer-events: none;
  color: inherit;
  text-decoration: none;
}

.searchbar__input {
  background-color: white;
}

.domain-selector {
  .v-btn__content {
    flex-direction: row !important;
  }

  .v-icon {
    margin-right: 1rem !important;
  }
}
</style>