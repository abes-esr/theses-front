<template>
  <MessageBox ref="messageBox"></MessageBox>
  <div class="buttons">
    <div class="buttons-header">
      <h2 class="buttons-header-title">{{ $t("theseView.access") }}</h2>
      <button v-if="mobile" @click="closeOverlay" class="close-icon" elevation="0" color="transparent">
        <div class="close-overlay-icon-wrapper">
          <div>
            <v-icon size="35">mdi-close-box</v-icon>
          </div>
        </div>
      </button>
    </div>

    <!--  Catégorie validée par le jury -->
    <div v-if="categoriesValide.length > 0 && soutenue">
      <div class="header-container no-wrap-text">
        <v-icon color="primary" class="menu-icon">mdi-certificate</v-icon>
        <h3 class="buttons-title-header">{{ $t("theseView.valide") }}</h3>
      </div>
      <v-expansion-panels multiple v-model="panel" variant="accordion" class="buttons-list-wrapper">
        <template v-for="sousCategorie in categoriesValide" :key="sousCategorie.libelle">
          <v-expansion-panel v-if="sousCategorie.boutons.length > 0">
            <!--            Intitulé de la catégorie-->
            <v-expansion-panel-title class="sous-categorie-header" >
              <h4 id="categories-valide-title">
                {{ $t(sousCategorie.libelle) }}
              </h4>
            </v-expansion-panel-title>
            <v-expansion-panel-text role="list" aria-labelledby="categories-valide-title">
              <div class="buttons-list" v-for="b in sousCategorie.boutons" :key="b">
                <v-btn v-if="b.typeAcces == 'ACCES_ESR'" role="listitem" class="thesis-access-buttons" append-icon="mdi-open-in-new"
                  @click="checkboxModal = false; dialog = true; dialogUrl = b.url.startsWith('http') ? b.url : baseURL + b.url"
                  :aria-label="$t(b.libelle) + $t('externalLink')" :flat="true">{{ $t(b.libelle) }}
                </v-btn>
                <v-btn v-else-if="b.url" role="listitem" class="thesis-access-buttons" append-icon="mdi-open-in-new"
                  :href="b.url.startsWith('http') ? b.url : baseURL + b.url" target="_blank" :title="$t(b.libelle)  + $t('externalLink')"
                  :aria-label="$t(b.libelle)" :flat="true">{{ $t(b.libelle) }}
                </v-btn>
                <v-card v-else-if="b.libelle === 'Embargo' || b.libelle === 'Confidentialite'" class="texte-embargo" role="listitem" variant="outlined" tabindex="0">
                  <img :alt="$t('theseView.alertSign')" class="icon-alert"
                    src="@/assets/triangle-exclamation-solid.svg" />
                  <span v-if="b.libelle === 'Embargo'">{{ $t("theseView.embargo") }} {{ b.dateFin.replaceAll("-", "/")
                    }}.</span>
                  <span v-if="b.libelle === 'Confidentialite'">{{ $t("theseView.confidentialite") }} {{ b.dateFin.replaceAll("-", "/")
      }}</span>
                </v-card>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </template>
      </v-expansion-panels>
    </div>
    <!--  Catégorie Autres versions-->
    <div v-if="boutonsAutres.length > 0 && soutenue">
      <v-expansion-panels v-model="panel2" multiple variant="accordion" class="v-expansion-panels-other">
        <v-expansion-panel class="buttons-sub-header buttons-sub-header-other">
          <v-expansion-panel-title>
            <v-icon color="primary" class="menu-icon">mdi-list-box</v-icon>
            <h3 class="buttons-title-header buttons-title-header-other" id="other-title">{{ $t("theseView.others") }}</h3>
          </v-expansion-panel-title>
          <v-expansion-panel-text role="list" aria-labelledby="other-title">
            <div class="buttons-list" v-for="b in boutonsAutres" :key="b">
              <v-btn v-if="b.url" role="listitem" class="thesis-access-buttons" append-icon="mdi-open-in-new"
                :href="b.url.startsWith('http') ? b.url : baseURL + b.url" target="_blank" :title="$t(b.libelle)  + $t('externalLink')"
                :aria-label="$t(b.libelle)" :flat="true">{{ $t(b.libelle) }}
              </v-btn>
              <v-card class="texte-embargo" role="listitem" variant="outlined" tabindex="0"
                v-if="b.libelle === 'Embargo' || b.libelle === 'Confidentialite'">
                <img :alt="$t('theseView.alertSign')" class="icon-alert"
                  src="@/assets/triangle-exclamation-solid.svg" />
                <span v-if="b.libelle === 'Embargo'">{{ $t("theseView.embargoStart") }}{{ b.dateFin.replaceAll("-", "/") }}{{ $t("theseView.embargoEnd") }}</span>
                <span v-if="b.libelle === 'Confidentialite'">{{ $t("theseView.confidentialite") }} {{ b.dateFin.replaceAll("-", "/") }}</span>
              </v-card>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <!--  Encart thèse en cours de traitement-->
    <div v-if="soutenue && status === 'enCours'" class="buttons-list-wrapper processing-status">
      <v-card class="texte-embargo" variant="outlined" tabindex="0">
        <img :alt="$t('theseView.alertSign')" class="icon-alert" src="@/assets/triangle-exclamation-solid.svg" />
        <span v-if="source === 'sudoc'">{{ $t("theseView.enTraitementStartYear") }}{{ dateVerifiee }}{{
        $t("theseView.enTraitementEnd") }}</span>
        <span v-else>{{ $t("theseView.enTraitementStartDay") }}{{ dateSoutenance }}{{ $t("theseView.enTraitementEnd")
          }}</span>
      </v-card>
    </div>
  </div>

  <!-- Modal Accès ESR -->
  <v-dialog v-model="dialog" :fullscreen="mobile" :width="mobile ? '100%' : '70%'">
    <v-card style="padding: 2rem 2rem; display: flex;" tabindex="0">
      <span v-html='$t("theseView.modalContent")'></span>
      <br />
      <v-checkbox v-model="checkboxModal" :label='$t("theseView.modalAgree")' />
      <div class="submit">
        <v-btn variant="outlined" size="large" @click="dialog = false">{{ $t('theseView.modalCancel')
          }}</v-btn>
        <v-btn variant="outlined" size="large" :disabled="!checkboxModal" target="_blank" :href="dialogUrl"
          @click="dialog = false">{{
        $t('theseView.modalOk') }}</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, defineAsyncComponent, toRaw } from "vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const MessageBox = defineAsyncComponent(() => import('@/components/common/MessageBox.vue'));
const messageBox = ref(null);

const props = defineProps({
  boutonsAutres: {
    type: Object,
    default: []
  },
  categoriesValide: {
    type: Object,
    default: []
  },
  soutenue: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: ''
  },
  dateSoutenance: {
    type: String,
    default: ''
  },
  source: {
    type: String,
    default: ''
  },
});

const emit = defineEmits(['closeOverlay']);

const config = useRuntimeConfig();
const baseURL = config.public.API;

const dialog = ref(false);
const checkboxModal = ref(false);
const dialogUrl = ref("");
//Pour ouvrir les 4 premiers panels par défaut
const panel = ref([0, 1, 2, 3, 4]);
const panel2 = ref([0, 1, 2, 3, 4]);
const dateVerifiee = ref(new Date());

if (props.source === 'sudoc') {
  // Récupérer l'année
  dateVerifiee.value = props.dateSoutenance.split('/')[2];
} else {
  dateVerifiee.value = props.dateSoutenance;
}
/**
 * Fonctions
 */
function closeOverlay() {
  emit('closeOverlay');
}
</script>

<style scoped lang="scss">
@use "vuetify/settings";

h4 {
  font-weight: 500;
  font-size: 16px;
  color: rgb(var(--v-theme-text-dark-blue));
  width: unset;
  background-color: unset;
  text-align: start;
}

.buttons-header {
  overflow: hidden;
  padding: 0.4em 0.8em 0;
  margin: 0.5em 0.5em 0.5em;
  display: flex;
  justify-content: space-between;
}

.buttons-header-title {
  color: rgb(var(--v-theme-text-dark-blue));
  font-size: 22px;
  font-weight: 600;
  font-family: Roboto-Bold, sans-serif;
  align-self: center;
}

.buttons-sub-header {
  overflow: hidden;
  padding: 0 1.4em;
  width: 100%;
  font-size: 18px;
  height: 42px;

  display: inline-flex;
  align-items: center;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
    padding: unset;
    font-size: 16px;
  }
}

.v-expansion-panels-other {
  display: unset;
}

.buttons-sub-header-other {
  overflow: unset !important;
  display: unset !important;
  padding: unset !important;

  :deep(.v-expansion-panel-title__overlay) {
    background-color: rgb(var(--v-theme-surface));
  }

  :deep(.v-expansion-panel__shadow) {
    box-shadow: unset;
  }

  :deep(.v-expansion-panel-title) {
    min-height: 28px;
    padding: 0 0.8em;
  }

  :deep(.v-expansion-panel-text) {
    padding-top: 0.3em;
  }

  :deep(.v-expansion-panel-text__wrapper) {
    padding: unset;
  }

  :deep(.v-btn__content) {
    white-space: break-spaces;
  }

  :deep(.v-btn--density-default) {
    height: unset;
    padding: 0.8em 1em;
  }
}

.sous-categorie-header {
  overflow: hidden;
  padding: 0 1em;
  margin-bottom: 0.8em;
  font-size: 16px;
  text-align: start;
  font-weight: 500;
}

.texte-embargo {
  width: 80%;
  padding: 0.8em 0;
  margin-bottom: 1em;
  border: thin solid rgb(var(--v-theme-gris-fonce));

  display: inline-grid;
  grid-template-columns: 25fr 75fr;

  span {
    color: rgb(var(--v-theme-primary));
  }

  .icon-alert {
    align-self: center;
    justify-self: center;
    margin: 10px;
  }

  .icon-alert path {
    fill: rgb(var(--v-theme-orange-abes));
  }

  span {
    font-family: Roboto, sans-serif;
    font-size: 14px;
    font-weight: 600;
    padding-right: 1em;
    align-self: center;
    justify-self: center;
    word-break: break-word;
  }
}

.menu-icon {
  height: 100%;
  grid-column-start: 1;
  align-items: start;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
    grid-column-start: unset;
  }
}

.v-icon--size-default {
  font-size: 28px;
}

.header-container {
  display: inline-grid;
  grid-template-columns: 40px 100fr;
  padding: 0 10px;
  color: rgb(var(--v-theme-text-dark-blue));

  @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
    width: 100%;
    font-size: 16px;
    padding: 0 10px;
  }
}

.buttons-title-header {
  height: 100%;
  grid-column-start: 2;
  background-color: transparent;
  overflow: visible !important;

  display: flex;
  white-space: normal;
  word-break: break-word;
  overflow-wrap: break-word;

  font-size: 20px;
  font-weight: 500;
  font-family: Roboto-Regular, sans-serif;
  color: rgb(var(--v-text-dark-blue));

  @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
    grid-column-start: unset;
  }
}

.buttons-title-header-other {
  margin-top: 0 !important;
}

:deep(.v-expansion-panel::after) {
  border-top-style: none !important;
}

.buttons-list-wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  opacity: 1;

  :deep(.v-expansion-panel-title) {
    min-height: 28px !important;
  }

  :deep(.v-expansion-panel__shadow) {
    box-shadow: unset;
  }

  :deep(.v-expansion-panel-title__overlay) {
    background-color: rgb(var(--v-theme-surface));
  }

  :deep(.v-expansion-panel-text__wrapper) {
    padding: unset;
  }

  :deep(.v-btn__content) {
    white-space: break-spaces;
  }
}

.processing-status {
  flex-direction: row !important;
  margin-top: 1.5em;
}

.buttons-list {
  display: flex;
  flex-direction: column;
  align-items: center;

  .v-btn {
    text-align: start !important;
    display: inline-flex;
    justify-content: space-between;
    text-transform: none;
    margin-bottom: 1em;
    width: 80%;
  }

  :deep(.v-btn--density-default) {
    height: unset;
    padding: 0.8em 1em;
  }
}

.buttons,
.skeleton-loader-wrapper {
  display: flex;
  flex-direction: column;
  border-right: 2px solid rgb(var(--v-theme-gris-clair));

  .skeleton {
    height: 36px !important;
    width: 85%;
    background-color: rgb(var(--v-theme-gris-clair));
    margin-bottom: 1em;
  }

  .filters-btn {
    margin-top: 15px;
  }
}

.close-icon {
  color: rgb(var(--v-theme-orange-abes));
  position: unset;
}

:deep(.v-skeleton-loader__button) {
  max-width: unset !important;
}

// Style modal Acces ESR
:deep(li) {
  margin-left: 3rem !important;
}

:deep(.v-label--clickable) {
  opacity: 1 !important;
}

.submit {
  display: flex;
  justify-content: flex-end;
  margin-right: 10px;

  .v-btn {
    margin-left: 10px;
  }
}

.thesis-access-buttons {
  background-color: rgb(var(--v-theme-secondary-darken-3));
  color: rgb(var(--v-theme-white-text));
}
</style>
