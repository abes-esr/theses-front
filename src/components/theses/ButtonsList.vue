<template>
  <MessageBox ref="messageBox"></MessageBox>
  <div class="buttons">
    <div class="buttons-header">
      <span>{{ $t("theseView.access") }}</span>
    </div>
    <div class="buttons-sub-header">
      <div class="header-container no-wrap-text">
        <v-icon color="primary" class="menu-icon">mdi-certificate</v-icon>
        <span class="buttons-title-header"><span v-if="soutenue">{{ $t("theseView.valide") }}</span></span>
        <button v-if="mobile" @click="closeOverlay" class="close-icon" elevation="0" color="transparent">
          <div class="close-overlay-icon-wrapper">
            <div class="circle"></div>
            <div><v-icon size="35">mdi-close-box</v-icon></div>
          </div>
        </button>
      </div>
    </div>
    <div class="list-buttons no-wrap-text" v-if="soutenue">
      <v-btn color="secondary-darken-2" append-icon="mdi-arrow-right-circle" flat v-for="b in listButtons" :key="b"
        :href="baseURL + b.url" target="_blank" :title="b.libelle" :aria-label="b.libelle">{{
          b.libelle }}</v-btn>
      <v-skeleton-loader v-if="loading" :key="i" type="list-item" class="skeleton"></v-skeleton-loader>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineAsyncComponent } from "vue";
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
  },
  soutenue: {
    type: Boolean,
  }
});

const emit = defineEmits('closeOverlay');

const { getButtons } = thesesAPIService();
const loading = ref(false);
const listButtons = ref([]);
const baseURL = import.meta.env.VITE_APP_API;

watch(
  () => props.soutenue,
  () => {
    if (props.soutenue) {
      getButtons(props.nnt).then((res) => {
        listButtons.value = res.data.buttons;
      })
        .catch((err) => {
          displayError("Accès en ligne : " + err.message);
        })
        .finally(() => {
          loading.value = false;
        });
    }
  }
);


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
</style>
