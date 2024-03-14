<template>
  <v-app :class="{ 'opendys': opendys, 'interlignes': interlignes, 'justification': justification }">

    <CommonHeaderCustom></CommonHeaderCustom>
    <v-main>
      <NuxtPage></NuxtPage>
    </v-main>
    <CommonFooterCustom></CommonFooterCustom>
  </v-app>
</template>

<script setup>
import { watch, onMounted } from 'vue';

useHead({
  title: "Theses.fr",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  charset: "utf-8",
  meta: [{ name: "description", content: "Moteur de recherche des thèses françaises, theses.fr propose l’accès aux thèses de doctorat soutenues ou en préparation." }],
  script: [
    {
      async: true,
      children: ` var _paq = window._paq = window._paq || []; _paq.push(['trackPageView']); _paq.push(['enableLinkTracking']); (function() { var u="https://piwik.abes.fr/"; _paq.push(['setTrackerUrl', u+'matomo.php']); _paq.push(['setSiteId', '5']); var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0]; g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);})();`
    }
  ],
});

//Accessibilite
const opendys = useState('opendys', () => false);
const interlignes = useState('interlignes', () => false);
const justification = useState('justification', () => false);

//Persistence en localStorage des préférences de l'utilisateur
onMounted(() => {
  opendys.value = getFromLocalStorage('opendys', false);
  interlignes.value = getFromLocalStorage('interlignes', false);
  justification.value = getFromLocalStorage('justification', false);
});

const getFromLocalStorage = (key, defaultValue) => {
  const storedValue = localStorage.getItem(key);
  return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
};

watch(opendys, (newValue) => {
  localStorage.setItem('opendys', JSON.stringify(newValue));
});

watch(interlignes, (newValue) => {
  localStorage.setItem('interlignes', JSON.stringify(newValue));
});

watch(justification, (newValue) => {
  localStorage.setItem('justification', JSON.stringify(newValue));
});
</script>

<style lang="scss">
@use 'vuetify/settings';

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

.searchbar__input .v-field {
  background-color: white;
}



.domain-selector {
  @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
    .v-btn__content {
      flex-direction: row !important;
    }

    .v-icon {
      margin-right: 1rem !important;
    }
  }
}

//Accessibilité
@import url('https://fonts.cdnfonts.com/css/open-dyslexic');

.opendys * {
  font-family: 'Open-Dyslexic', sans-serif !important;
}

.interlignes * :not(.v-btn__content, .v-btn, .v-input, .v-field, .v-input__control, .v-label, .v-field__field, .v-select, .v-field__overlay, .v-field__input, .v-select__selection, .v-select__selection-text) {
  line-height: 2rem !important;
}

.justification p {
  text-justify: none !important;
  text-align: unset !important;
}

.sr-only {
  position: absolute;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.idref-logo {
  display: flex;
  flex-direction: column;
  color: rgb(var(--v-theme-text-dark-blue));
  font-size: 0.9em;
  text-align: center;
  text-decoration: none;
}

.toolbar-container {
  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    order: 10;
  }
}
</style>