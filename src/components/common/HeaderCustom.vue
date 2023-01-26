<template>
    <v-app-bar color="white" id="appBar">
            <div class="text-center text-md-left">
                <v-btn flat depressed @click="$i18n.locale = 'fr'">FR</v-btn>|<v-btn flat depressed
                    @click="$i18n.locale = 'en'">EN</v-btn>
            </div>
            <div class="text-center text-md-right">
                <v-btn icon="$reseau" size="x-large"></v-btn>
              <v-btn icon="$rss" size="x-large"></v-btn>
              <v-btn icon="$assistance" size="x-large"></v-btn>
              <v-btn icon="$documentation" size="x-large"></v-btn>
            </div>
    </v-app-bar>
</template>

<style  scoped lang="scss">
@use 'vuetify/settings';

header {
  position: relative !important;
  padding-bottom:50px;
  border-bottom: solid rgb(var(--v-theme-gris-clair)) 1px !important;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
    height: 100px;
    padding-bottom: 0;
  }

    ::v-deep(.v-toolbar__content) {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      height: 100% !important;

     @media #{ map-get(settings.$display-breakpoints, 'sm-and-up')} {
      justify-content: space-between;
        flex-wrap: wrap;
      }
    }
}

</style>