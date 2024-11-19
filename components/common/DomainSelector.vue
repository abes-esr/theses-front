<template>
  <div class="domain-selector" role="list">
    <div role="listitem">
      <v-btn flat @click="select('theses')" :title="$t('rechercherTheses')" role="button">
        <v-icon size="50" color="secondary">mdi-school</v-icon>
        <span class="title">
          <h2 :class="selected === 'theses' ? 'selected' : ''">
            {{ $t("toutesTheses") }}
          </h2>
        </span>
      </v-btn>
    </div>
    <v-divider aria-hidden="true" vertical></v-divider>
    <div role="listitem">
      <v-btn flat @click="select('personnes')" :title="$t('rechercherPersonnes')" role="button">
        <v-icon size="50" color="secondary">mdi-account-multiple</v-icon>
<!--        Pas de sous-titre en anglais => souligner tout le titre-->
        <span class="title" :class="(locale === 'en' && selected === 'personnes') ? 'selected' : ''">
          <h2>
            {{ $t("toutesPersonnes") }}
            <br />
          <span :class="selected === 'personnes' ? 'selected' : ''" id="personnes-subtitle">{{ $t("toutesPersonnesSubtitle") }}</span></h2>
        </span>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const selected = ref('theses');
const router = useRouter();
const currentRoute = useRoute();

function init() {
  if (currentRoute.query.domaine !== undefined && currentRoute.query.domaine !== "undefined") {
    selected.value = currentRoute.query.domaine;
  } else if (currentRoute.name !== "id") {
    select("theses")
  }
}

async function select(selection) {
  selected.value = selection;
  let currentURLParams = Object.assign({}, currentRoute.query);

  if (currentURLParams && currentURLParams.domaine) {
    currentURLParams.domaine = selection;
  } else {
    currentURLParams = { domaine: selection };
  }
  await router.replace({
    query: currentURLParams
  })
}

watch(() => currentRoute.path, () => {
  init();
}, { immediate: true, deep: true });


</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.domain-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: transparent;
  margin: 1.5rem 0 1rem 0;

  div {
    justify-content: space-evenly;
    flex: 0 1 48%;
    display: flex;
    padding: 0;

    .v-btn {
      background-color: transparent;
      height: 100%;

      ::v-deep(.v-btn__content) {
        display: flex;
        flex-direction: column;
        letter-spacing: 0.07em;

        h2 {
          font-weight: 500;
          font-size: 14px;
          line-height: 48px;

          @media #{ map-get(settings.$display-breakpoints, 'lg-and-up')} {
            font-size: 18px;
            line-height: 64px;
          }
        }
      }
    }
  }

  .v-divider {
    color: rgb(var(--v-theme-gris-fonce));
    opacity: 0.5;
    border-width: 0 2px 0 0;
    margin: 0 2rem 0 2rem;

    @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
      margin-top: 1em;
    }
  }
}

.selected {
  text-decoration: underline;
  text-decoration-thickness: 4px;
  text-underline-offset: 8px;
  text-decoration-color: rgb(var(--v-theme-orange-abes));
}

.title {
  height: 64px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h2 {
  line-height: unset !important;
}

#personnes-subtitle {
  font-size: 0.875rem;
  letter-spacing: normal;
  font-weight: 400;
  text-transform: none;
}

</style>