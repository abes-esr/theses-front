<template>
  <MessageBox ref="messageBox"></MessageBox>
  <div class="buttons" v-if="categories.length > 0">
      <div class="buttons-header">
        <span>{{ $t("theseView.access") }}</span>
        <button v-if="mobile" @click="closeOverlay" class="close-icon" elevation="0" color="transparent">
          <div class="close-overlay-icon-wrapper">
            <div>
              <v-icon size="35">mdi-close-box</v-icon>
            </div>
          </div>
        </button>
      </div>

      <!--  Catégorie validé par le jury -->
      <div v-if="categoriesValide.length > 0 && soutenue">
          <div class="header-container no-wrap-text">
            <v-icon color="primary" class="menu-icon">mdi-certificate</v-icon>
            <span class="buttons-title-header">{{ $t("theseView.valide") }}</span>
          </div>
            <v-expansion-panels multiple v-model="panel" variant="accordion" v-for="sousCategorie in categoriesValide" class="buttons-list-wrapper" :key="sousCategorie.libelle">
              <v-expansion-panel :value="sousCategorie.libelle" v-if="sousCategorie.boutons.length > 0">
                <!--            Intitulé de la catégorie-->
                <v-expansion-panel-title class="sous-categorie-header">
                  {{ sousCategorie.libelle }}
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="buttons-list" v-for="b in sousCategorie.boutons" :key="b">
                  <v-btn v-if="b.url" color="secondary-darken-2" append-icon="mdi-arrow-right-circle"
                         :href="b.url.startsWith('http') ? b.url : baseURL + b.url"
                         target="_blank" :title="b.libelle" :aria-label="b.libelle">{{
                      b.libelle }}
                  </v-btn>
                    <v-card class="texte-embargo" v-else>
                      <img :alt="$t('theseView.alertSign')" class="icon-alert" src="@/assets/triangle-exclamation-solid.svg" />
                      <span v-if="b.libelle === 'Embargo'">{{ $t("theseView.embargo") }} {{ b.dateFin }}</span>
                      <span v-if="b.libelle === 'Confidentialité'">{{ $t("theseView.confidentialite") }} {{ b.dateFin }}</span>
                    </v-card>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
      </div>
      <!--  Catégorie Autres versions-->
    <div v-if="boutonsAutres.length > 0 && soutenue">
      <v-expansion-panels multiple variant="accordion" class="v-expansion-panels-other">
        <v-expansion-panel class="buttons-sub-header buttons-sub-header-other">
          <v-expansion-panel-title>
            <v-icon color="primary" class="menu-icon">mdi-list-box</v-icon>
            <span class="buttons-title-header buttons-title-header-other">{{ $t("theseView.others") }}</span>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div class="buttons-list" v-for="b in sousCategorie.boutons" :key="b">
              <v-btn v-if="b.url" color="secondary-darken-2" append-icon="mdi-arrow-right-circle"
                     :href="b.url.startsWith('http') ? b.url : baseURL + b.url"
                     target="_blank" :title="b.libelle" :aria-label="b.libelle">{{
                  b.libelle }}
              </v-btn>
              <v-card class="texte-embargo" v-else>
                <img :alt="$t('theseView.alertSign')" class="icon-alert" src="@/assets/triangle-exclamation-solid.svg" />
                <span v-if="b.libelle === 'Embargo'">{{ $t("theseView.embargo") }} {{ b.dateFin }}</span>
                <span v-if="b.libelle === 'Confidentialité'">{{ $t("theseView.confidentialite") }} {{ b.dateFin }}</span>
              </v-card>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>

  <!-- Modal Accès ESR -->
  <v-dialog v-model="dialog" :fullscreen="mobile" :width="mobile ? '100%' : '70%'">
    <v-card style="padding: 2rem 2rem; display: flex;">
      <span v-html='$t("theseView.modalContent")'></span>
      <br />
      <v-checkbox v-model="checkboxModal" :label='$t("theseView.modalAgree")' />
      <div class="submit">
        <v-btn variant="outlined" size="large" @click="dialog = false">{{ $t('theseView.modalCancel')
        }}</v-btn>
        <v-btn variant="outlined" size="large" :disabled="!checkboxModal" target="_blank" :href="dialogUrl">{{
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
  categories: {
    type: Object,
    default: []
  },
  soutenue: {
    type: Boolean,
    default: false
  }
});

defineEmits(['closeOverlay']);

const config = useRuntimeConfig();
const baseURL = config.public.API;

const dialog = ref(false);
const checkboxModal = ref(false);
const dialogUrl = ref("");
const categoriesValide = ref([]);
const boutonsAutres = ref([]);

const panel = ref(["Dépôt national"]);

watch(() => props.categories, () => {
  categoriesValide.value = props.categories.filter((category) => category.libelle === "Validé par le jury")[0]['sousCategories'];
  boutonsAutres.value = props.categories.filter((category) => category.libelle === "Autres versions")[0]['boutons'];

  putEmbargoTextAndESRButtonBeforeEveryhting();
});

/**
 * Fonctions
 */
function closeOverlay() {
  emit('closeOverlay');
}

function putEmbargoTextAndESRButtonBeforeEveryhting() {
  categoriesValide.value.forEach(sousCategorie => {
    if (sousCategorie.libelle === "Dépôt national") {
      let indexEmbargo = sousCategorie.boutons.findIndex((bouton) => bouton.typeAcces === "EMBARGO");

      if (indexEmbargo > -1) {
        let embargoObject = sousCategorie.boutons.splice(indexEmbargo, 1);
        sousCategorie.boutons.splice(0, 0, toRaw(embargoObject[0]));

        let indexESR = sousCategorie.boutons.findIndex((bouton) => bouton.typeAcces === "ACCES_ESR");
        if (indexESR > -1) {
          let esrObject = sousCategorie.boutons.splice(indexESR, 1);
          sousCategorie.boutons.splice(1, 0, toRaw(esrObject[0]));
        }
      }
    }
  });
}
</script>

<style scoped lang="scss">
@use "vuetify/settings";

.buttons-header {
  overflow: hidden;
  padding: 0.4em 0.8em 0;

  font-size: 22px;
  font-weight: 600;
  font-family: Roboto-Bold, sans-serif;

  display: flex;
  justify-content: space-between;
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
}

.texte-embargo {
  width: 80%;
  padding: 0.8em 0;
  margin-bottom: 1em;

  display: inline-grid;
  grid-template-columns: 25fr 75fr;

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
    font-size: 16px;
    font-weight: 600;
    padding-right: 1em;
    align-self: center;
    justify-self: center;
    word-break: break-word;
  }
}

.sous-categorie-header {
  font-weight: 500;
}

.header-container {
  height: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr 100fr;
  grid-template-rows: 20% 60% 20%;
  padding: 0 10px;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
    width: 100%;
    grid-template-columns: 1fr 10fr 3fr;
    font-size: 16px;
    padding: 0 10px;
  }
}

.menu-icon {
  height: 100%;
  grid-column-start: 1;
  grid-row-start: 2;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
    grid-column-start: unset;
  }
}

.v-icon--size-default {
  font-size: 28px;
}

.buttons-title-header {
  height: 100%;
  grid-column-start: 3;
  grid-row-start: 2;
  background-color: transparent;
  margin-top: -5px;
  overflow: visible !important;

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

.buttons-list-wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;

  :deep(.v-expansion-panel-title) {
    min-height: 28px;
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

.buttons-list {
  display: flex;
  flex-direction: column;
  align-items: center;

  .v-btn {
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
</style>
