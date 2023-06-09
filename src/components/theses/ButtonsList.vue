<template>
  <MessageBox ref="messageBox"></MessageBox>
  <div class="buttons">
    <div class="buttons-header">
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
    <div class="listButtons no-wrap-text">
      <v-btn color="primary" append-icon="mdi-arrow-right-circle" class="" flat v-for="b in listButtons" :key="b"
        :href="baseURL + b.url" target="_blank" :title="b.libelle" :aria-label="b.libelle">{{
          b.libelle }}</v-btn>
      <v-skeleton-loader v-if="loading" :key="i" type="list-item" class="skeleton"></v-skeleton-loader>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from "vue";
import { thesesAPIService } from '@/services/ThesesAPI';
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const MessageBox = defineAsyncComponent(() => import('@/components/common/MessageBox.vue'));
const messageBox = ref(null);
function displayError(message) {
  messageBox.value?.open(message, {
    type: "error"
  });
}

const props = defineProps({
  nnt: {
    type: String,
    default: ""
  }
});

const emit = defineEmits('closeOverlay');

const { getButtons } = thesesAPIService();
const loading = ref(true);
const listButtons = ref([]);
const baseURL = import.meta.env.VITE_APP_API;

onMounted(() => {
  getButtons(props.nnt).then((res) => {
    listButtons.value = res.data.buttons;
  })
    .catch((err) => {
      displayError("Accès en ligne : " + err.message);
    })
    .finally(() => {
      loading.value = false;
    });

});

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
  padding: 4px 20px;
  width: 100%;
  background-color: rgb(var(--v-theme-gris-clair));
  font-size: 22px;
  height: 42px;

  display: inline-flex;
  align-items: center;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
    padding: unset;
    font-size: 16px;
  }

  margin-bottom: 1em;
}

.header-container {
  height: 2rem;
  display: inline-grid;
  grid-template-columns: 2fr 1fr 10fr;
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

.listButtons {
  display: flex;
  flex-direction: column;
  align-items: center;

  .v-btn {
    width: 85%;
    margin-bottom: 10px;
    display: inline-flex;
    justify-content: space-between;
    text-transform: none;
    margin-bottom: 1em;

  }
}

.buttons {
  display: flex;
  flex-direction: column;

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

</style>
