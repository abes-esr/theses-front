<template>
  <MessageBox ref="messageBox"></MessageBox>
  <div class="buttons">
    <div class="search-filter">
      <div class="filter-meta no-wrap-text">
        <v-icon color="primary" class="menu-icon">mdi-certificate</v-icon>
        <span class="buttons-title-header">{{ $t("theseView.valide") }}</span>
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


</script>

<style scoped lang="scss">
@use "vuetify/settings";

.search-filter {
  overflow: hidden;
  padding: 4px 20px;
  width: 100%;
  background-color: rgb(var(--v-theme-gris-clair));
  font-size: 22px;
  height: 42px;

  display: inline-flex;
  align-items: center;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
    padding: 0 7%;
    font-size: 16px;
  }

  margin-bottom: 1em;
}

.filter-meta {
  height: 2rem;
  display: inline-grid;
  grid-template-columns: 2fr 1fr 10fr;
  grid-template-rows: 20% 60% 20%;
}

.menu-icon {
  height: 100%;
  grid-column-start: 1;
  grid-row-start: 2;
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
</style>
