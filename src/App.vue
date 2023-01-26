<template>
  <v-app>
    <header-custom></header-custom>
    <RouterLink :to="{ name: 'home'}">
      <img class="logo" alt="logo"
           id="logoIMG" src="@/assets/icone-theses.svg"/>
    </RouterLink>
    <v-main>
      <router-view/>
    </v-main>
    <footer-custom></footer-custom>
  </v-app>
</template>

<script>
import HeaderCustom from "@/components/common/HeaderCustom.vue";
import FooterCustom from "./components/common/FooterCustom.vue";

export default {
  components: {
    HeaderCustom,
    FooterCustom
  },
  name: 'App',

  data: () => ({
    //
  }),
}
</script>

<style lang="scss">

.v-application__wrap {
  justify-content: center;
  align-items: center;
}

main {
  width: 100vw;
  padding-bottom: 64px !important;
  color: rgb(var(--v-theme-text-dark-blue)) !important;
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

.logo {
  position: relative;
  z-index: 2000;
  margin-top:-50%;
  height: 100px;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-up')} {
    height: 150px;
  }
}

</style>