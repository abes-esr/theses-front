<template>
  <metainfo>
    <template v-slot:title="{ content }">{{ content }} | Theses.fr</template>
  </metainfo>
  <v-app>
    <header-custom></header-custom>
    <v-main>
      <router-view/>
    </v-main>
    <footer-custom></footer-custom>
  </v-app>
</template>

<script>
import HeaderCustom from "@/components/common/HeaderCustom.vue";
import FooterCustom from "./components/common/FooterCustom.vue";
import {useMeta} from 'vue-meta';
import {useI18n} from "vue-i18n";


export default {
  components: {
    HeaderCustom,
    FooterCustom
  },
  name: 'App',
  setup() {
    const {t} = useI18n();
    useMeta({
      title: t("meta.titre"),
      description: t("meta.desc")
    });
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

  .logo-menu-wrapper > .expanded-search-bar-container {
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