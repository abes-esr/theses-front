<template>
  <metainfo>
    <template v-slot:title="{ content }">{{ content }} | Theses.fr</template>
  </metainfo>
  <v-app>
    <header-custom></header-custom>
    <v-main>
      <router-view />
    </v-main>
    <footer-custom></footer-custom>
  </v-app>
</template>

<script>
import HeaderCustom from "@/components/common/HeaderCustom.vue";
import FooterCustom from "./components/common/FooterCustom.vue";
import { useMeta } from 'vue-meta';
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

  .logo {
    height: 100%;
    margin-top: -35px;
    position: relative;
    z-index: 2000;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-up')} {
      margin-top: -75px;
    }

    img {
      height: 70px;

      @media #{ map-get(settings.$display-breakpoints, 'sm-and-up')} {
        height: 150px;
      }
    }
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
  color: rgb(var(--v-theme-secondary));
}

h4 {
  color: rgb(var(--v-theme-primary));
  font-size: 1.2rem;
}

.clickable {
  cursor: pointer;
}
</style>
<style scoped lang="scss">
@use 'vuetify/settings';
</style>