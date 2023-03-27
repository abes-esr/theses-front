<template>
  <v-app-bar flat color="white" id="appBar">
    <div class="text-center text-md-left">
      <v-btn flat depressed @click="$i18n.locale = 'fr'" title="Langue française">FR</v-btn>
      |
      <v-btn flat depressed @click="$i18n.locale = 'en'" title="English Language">EN
      </v-btn>
    </div>
    <div class="text-center text-md-right">
      <v-btn icon="$reseau" title="Réseau" size="x-large"></v-btn>
      <v-btn icon="$rss" title="Flux RSS" size="x-large"></v-btn>
      <a href="https://stp.abes.fr/node/3?origine=thesesFr" target="_blank" :alt='$t("header.assistance")'><v-btn
          icon="$assistance" :title='$t("header.assistance")' size="x-large"></v-btn></a>
      <a href="http://documentation.abes.fr/aidethesesfr/index.html" :alt='$t("header.doc")' target="_blank"><v-btn
          icon="$documentation" :title='$t("header.doc")' size="x-large"></v-btn></a>
    </div>
  </v-app-bar>
</template>

<style scoped lang="scss">
@use 'vuetify/settings';

header {
  position: relative !important;
  height: 120px;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-up')} {
    height: 80px;
  }

  @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
    border-bottom: 2px solid rgb(var(--v-theme-gris-fonce));
  }

  ::v-deep(.v-toolbar__content) {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    min-height: 80px;
    margin-top: 10px;
    margin-bottom: 10px;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-up')} {
      justify-content: space-between;
      flex-wrap: wrap;
      margin-top: 0;
    }

    .v-icon {
      font-size: 25px;

      @media #{ map-get(settings.$display-breakpoints, 'sm-and-up')} {
        font-size: 40px;
      }
    }
  }
}
</style>