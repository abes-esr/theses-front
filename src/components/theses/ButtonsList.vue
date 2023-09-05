<template>
  <MessageBox ref="messageBox"></MessageBox>
  <div class="buttons" v-if="dataReady">
    <div v-if="listButtons.length > 0">
      <div class="buttons-header">
        <span>{{ $t("theseView.access") }}</span>
      </div>
      <div class="buttons-sub-header">
        <div class="header-container no-wrap-text">
          <v-icon color="primary" class="menu-icon">mdi-certificate</v-icon>
          <span class="buttons-title-header">{{ $t("theseView.valide") }}</span>
          <button v-if="mobile" @click="closeOverlay" class="close-icon" elevation="0" color="transparent">
            <div class="close-overlay-icon-wrapper">
              <div class="circle"></div>
              <div><v-icon size="35">mdi-close-box</v-icon></div>
            </div>
          </button>
        </div>
      </div>
      <div v-if="soutenue">
        <div class="list-buttons no-wrap-text" v-for="b in listButtons" :key="b">
          <span v-if="b.url" style="width: 90%;">
            <v-btn v-if="b.libelle === 'Accès ESR'" color="secondary-darken-2" flat block
              append-icon="mdi-arrow-right-circle" :title="b.libelle" :aria-label="b.libelle"
              @click="dialog = true; dialogUrl = baseURL + b.url; checkboxModal = false;">{{
                b.libelle }}</v-btn>
            <v-btn v-else color="secondary-darken-2" append-icon="mdi-arrow-right-circle" flat block
              :href="baseURL + b.url" target="_blank" :title="b.libelle" :aria-label="b.libelle">{{
                b.libelle }}</v-btn>
          </span>
          <span v-else>
            <span v-if="b.libelle === 'Embargo'">{{ $t("theseView.embargo") }} {{ b.dateFin }}</span>
            <span v-if="b.libelle === 'Confidentialité'">{{ $t("theseView.confidentialite") }} {{ b.dateFin }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
  <div class="skeleton-loader-wrapper" v-else>
    <v-skeleton-loader type="list-item-two-line"></v-skeleton-loader>
    <v-skeleton-loader type="button" class="d-flex justify-center w-75 mx-15"></v-skeleton-loader>
    <v-skeleton-loader type="button" class="d-flex justify-center w-75 mx-15"></v-skeleton-loader>
  </div>

  <!-- Modal Accès ESR -->
  <v-dialog v-model="dialog" :fullscreen="mobile" :width="mobile ? '100%' : '70%'">
    <v-card style="padding: 2rem 2rem; display: flex;">
      <span v-html='$t("theseView.modalContent")'></span>
      <br />
      <v-checkbox v-model="checkboxModal" :label='$t("theseView.modalAgree")' />
      <div class="submit">
        <v-btn flat variant="outlined" size="large" @click="dialog = false">{{ $t('theseView.modalCancel')
        }}</v-btn>
        <v-btn flat variant="outlined" size="large" :disabled="!checkboxModal" target="_blank" :href="dialogUrl">{{
          $t('theseView.modalOk') }}</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, defineAsyncComponent } from "vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const MessageBox = defineAsyncComponent(() => import('@/components/common/MessageBox.vue'));
const messageBox = ref(null);

defineProps({
  dataReady: {
    type: Boolean,
  },
  listButtons: {
    type: Object,
  },
  soutenue: {
    type: Boolean,
  }
});

const emit = defineEmits('closeOverlay');

const baseURL = import.meta.env.VITE_APP_API;

const dialog = ref(false);
const checkboxModal = ref(false);
const dialogUrl = ref("");

/**
 * Fonctions
 */
function closeOverlay() {
  emit('closeOverlay');
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

  margin-bottom: 0.6em;
}

.header-container {
  height: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr 100fr;
  grid-template-rows: 20% 60% 20%;

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

.list-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;

  .v-btn {
    width: 85%;
    display: inline-flex;
    justify-content: space-between;
    text-transform: none;
    margin-bottom: 1em;
  }
}

.buttons,
.skeleton-loader-wrapper {
  display: flex;
  flex-direction: column;
  border-right: 2px solid rgb(var(--v-theme-gris-clair));

  .buttons-list {
    width: 85%;
  }

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
  grid-column-end: 4;
  justify-self: end;
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
  justify-content: end;
  margin-right: 10px;

  .v-btn {
    margin-left: 10px;
  }
}
</style>
