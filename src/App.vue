<template>
  <v-app>
    <header-custom></header-custom>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import HeaderCustom from "@/components/common/HeaderCustom.vue";



export default {
  components: {
    HeaderCustom
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