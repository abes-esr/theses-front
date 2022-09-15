<template>
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

<style>
@import './styles/style.css';
</style>