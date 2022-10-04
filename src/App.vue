<template>
  <v-app>
    <header-custom></header-custom>
    <v-layout class="flex-shrink-0">
      <v-main>
        <router-view />
      </v-main>
    </v-layout>
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