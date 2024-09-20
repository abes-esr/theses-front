<template>
  <v-app-bar flat id="appBar" v-if="!mobile && isReady">
    <div class="toolbar-wrapper" role="list">
      <div class="text-center text-md-left language-accessibility-toolbar" role="listitem">

        <v-btn plain size="x-large" @click="dialog = true" :title="$t('access.btn')" role="button">
          <img :alt="$t('header.accessibility')" id="logo-handicap-visuel"
            :src="'/icone-handicap-visuel-' + colorMode + '.svg'" />
        </v-btn>
  <!--     Quand actif ajouter role="listitem" -->
<!--        <div class="languages-btn">-->
<!--          &lt;!&ndash; selecteur de langues désactivé &ndash;&gt;-->
<!--          <v-btn flat @click="setLanguage('fr')" title="Langue française"-->
<!--            :class="locale === 'fr' ? 'selected' : ''">FR</v-btn>-->
<!--          |-->
<!--          <v-btn flat @click="setLanguage('en')" title="English Language"-->
<!--            :class="locale === 'en' ? 'selected' : ''">EN</v-btn>-->
<!--          |-->
<!--          <v-btn flat @click="setLanguage('es')" title="Idioma espanol"-->
<!--            :class="locale === 'es' ? 'selected' : ''">ES</v-btn>-->
<!--        </div>-->
      </div>
      <div class="text-center text-md-right" role="presentation">
        <!--<v-btn tabindex="-1" title="Réseau" size="x-large" icon>
          <div class="icons"><icons-icon-reseau></icons-icon-reseau></div>
        </v-btn>
        <v-btn tabindex="-1" title="Flux RSS" size="x-large" icon>
          <div class="icons"><icons-icon-rss></icons-icon-rss></div>
        </v-btn>-->
        <a role="listitem" href="https://stp.abes.fr/node/3?origine=thesesFr" target="_blank" :alt='$t("header.assistance")'><v-btn
            tabindex="-1" :title='$t("header.assistance")' size="large" icon>
            <div class="icons"><img aria-hidden="true" :alt="$t('header.assistance')" id="logo-assistance" class="logos-droite"
                :src="'/icone-assistance-' + colorMode + '.svg'" /></div>
          </v-btn></a>
        <a role="listitem" href="http://documentation.abes.fr/aidethesesfr/index.html" :alt='$t("header.doc")' target="_blank"><v-btn
            tabindex="-1" :title='$t("header.doc")' size="large" icon>
            <div class="icons"><img aria-hidden="true" :alt="$t('header.doc')" id="logo-documentation" class="logos-droite"
                :src="'/icone-documentation-' + colorMode + '.svg'" /></div>
          </v-btn></a>
      </div>
    </div>
  </v-app-bar>

  <v-dialog v-model="dialog" width="auto" attach="true">
    <v-card>
      <v-card-title>{{ $t("access.params") }}</v-card-title>
      <v-card-text>
        <ul class="switch-list">
          <li><v-switch :label='$t("access.police")' v-model="opendys" inset></v-switch></li>
          <li><v-switch :label='$t("access.justification")' v-model="justification" inset></v-switch></li>
          <li><v-switch :label='$t("access.interligne")' v-model="interlignes" inset></v-switch></li>
          <li><v-switch :label='$t("access.contrast")' v-model="changeContrast" inset></v-switch></li>
        </ul>
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
  padding-top: 10px;
  margin-bottom: 10px;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
    height: 80px;
  }

  @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
    border-bottom: 2px solid rgb(var(--v-theme-gris-fonce));
  }

  .toolbar-wrapper {
    width: 100%;

    display: grid;
    min-height: 80px;

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
  display: grid; // dé-commenter si on active le bouton accessibilité
  grid-template-columns: 1fr 20px 3fr;
  margin: 0 30px 0;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
    grid-template-columns: 2fr 3fr 2fr;
  }
}

.languages-btn {
  grid-column-start: 3; // 3 si on active le bouton accessibilité
  max-height: 36px;
  align-self: center;

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

:deep(.v-switch__track) {
  background-color: rgb(var(--v-theme-gris-switch));
}

.switch-list {
  list-style-type: none;
}
</style>