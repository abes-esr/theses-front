<template>
  <v-app-bar flat id="appBar" v-if="!mobile && isReady">
    <div class="text-center text-md-left language-accessibility-toolbar">
      <v-btn plain size="x-large" @click="dialog = true" :title="$t('access.btn')">
        <img :alt="$t('header.accessibility')" id="logo-handicap-visuel"
          :src="'/icone-handicap-visuel-' + colorMode + '.svg'" />
      </v-btn>
      <div class="languages-btn">
        <!-- selecteur de langues désactivé
        <v-btn flat @click="setLanguage('fr')" title="Langue française"
          :class="locale === 'fr' ? 'selected' : ''">FR</v-btn>
        |
        <v-btn flat @click="setLanguage('en')" title="English Language"
          :class="locale === 'en' ? 'selected' : ''">EN</v-btn>
        |
        <v-btn flat @click="setLanguage('es')" title="English Language"
          :class="locale === 'es' ? 'selected' : ''">ES</v-btn>
          -->
      </div>
    </div>
    <div class="text-center text-md-right">
      <!--<v-btn tabindex="-1" title="Réseau" size="x-large" icon>
        <div class="icons"><icons-icon-reseau></icons-icon-reseau></div>
      </v-btn>
      <v-btn tabindex="-1" title="Flux RSS" size="x-large" icon>
        <div class="icons"><icons-icon-rss></icons-icon-rss></div>
      </v-btn>-->
      <a href="https://stp.abes.fr/node/3?origine=thesesFr" target="_blank" :alt='$t("header.assistance")'><v-btn
          tabindex="-1" :title='$t("header.assistance")' size="large" icon>
          <div class="icons"><img :alt="$t('header.assistance')" id="logo-assistance" class="logos-droite"
                                  :src="'/icone-assistance-' + colorMode + '.svg'" /></div>
        </v-btn></a>
      <a href="http://documentation.abes.fr/aidethesesfr/index.html" :alt='$t("header.doc")' target="_blank"><v-btn
          tabindex="-1" :title='$t("header.doc")' size="large" icon>
        <div class="icons"><img :alt="$t('header.doc')" id="logo-documentation" class="logos-droite"
                                :src="'/icone-documentation-' + colorMode + '.svg'" /></div>
        </v-btn></a>
    </div>
  </v-app-bar>

  <v-dialog v-model="dialog" width="auto">
    <v-card>
      <v-card-title>{{ $t("access.params") }}</v-card-title>
      <v-card-text>
        <v-switch :label='$t("access.police")' v-model="opendys" inset></v-switch>
        <v-switch :label='$t("access.justification")' v-model="justification" inset></v-switch>
        <v-switch :label='$t("access.interligne")' v-model="interlignes" inset></v-switch>
        <v-switch :label='$t("access.contrast")' v-model="changeContrast" inset></v-switch>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="dialog = false">{{ $t("access.fermer") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { onBeforeMount, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useDisplay, useTheme } from "vuetify";
import { useColorMode } from '@vueuse/core';

const theme = useTheme();
const { locale } = useI18n();
const { mobile } = useDisplay();

const isReady = ref(false);
//Paramètres d'accessibilité
const dialog = ref(false);
const opendys = useState('opendys');
const interlignes = useState('interlignes');
const justification = useState('justification');
const changeContrast = ref(false);

const themesNames = ref({
  "light": "abesLightTheme",
  "dark": "abesDarkTheme"
});

const colorMode = useColorMode({
  onChanged(color) {
    theme.global.name.value = themesNames.value[color];
  }
});

onBeforeMount(() => {
  // Etat par défaut du switch
  changeContrast.value = useColorMode().value === 'dark';
  isReady.value = true;
});

onMounted(() => {
  if (localStorage.getItem("language")) {
    locale.value = localStorage.getItem("language");

    useHead({
      htmlAttrs: {
        lang: locale.value,
      },
    })
  }
});

function setLanguage(lang) {
  localStorage.setItem("language", lang);
  locale.value = lang;
  useHead({
    htmlAttrs: {
      lang: lang,
    },
  })
}

/**
 * Watchers
 */
watch(changeContrast, newValue => {
  colorMode.value = newValue ? 'dark' : 'light';
});
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

header {
  position: relative !important;
  height: 120px;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
    height: 80px;
  }

  @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
    border-bottom: 2px solid rgb(var(--v-theme-gris-fonce));
  }

  ::v-deep(.v-toolbar__content) {
    display: grid;
    min-height: 80px;
    margin-top: 10px;
    margin-bottom: 10px;

    @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-top: 0;
    }

    .icons svg {
      width: 40px;
      height: 40px;
    }
  }
}

.language-accessibility-toolbar {
  //display: grid; // dé-commenter si si on active le bouton accessibilité
  //grid-template-columns: 1fr 20px 3fr;
  margin: 0 30px 0;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
    grid-template-columns: 2fr 3fr 2fr;
  }
}

.languages-btn {
  grid-column-start: 1; // 3 si on active le bouton accessibilité
  max-height: 36px;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
    grid-column-start: 2;

    .v-btn {
      min-width: unset;
      padding: 0 5px;
    }
  }
}

.logos-droite {
  height: 40px;
}

#logo-handicap-visuel {
  height: 30px;
  grid-column-start: 1;
  justify-self: center;
  align-self: center;
  //filter: invert(42%) sepia(93%) saturate(1352%) hue-rotate(87deg) brightness(119%) contrast(119%);

  @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
    grid-column-start: 1;
    justify-self: left;
  }
}

.selected {
  color: rgb(var(--v-theme-orange-abes));
  font-weight: 700;
}

:deep(.v-overlay__content) {
  .v-card-text * {
    font-size: 1.2rem !important;
  }

  label {
    color: rgb(var(--v-theme-text-dark-blue));

    opacity: 1;
  }
}
</style>