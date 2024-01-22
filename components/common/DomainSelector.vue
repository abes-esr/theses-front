<template>
  <div class="domain-selector">
    <v-btn flat @click="select('theses')" title="Rechercher des thèses">
      <v-icon size="50" color="secondary">mdi-school</v-icon>
      <span class="title">
        <h2 :class="selected === 'theses' ? 'selected' : ''">
          {{ $t("toutesTheses") }}
        </h2>
      </span>
    </v-btn>
    <v-divider vertical></v-divider>
    <v-btn flat @click="select('personnes')" title="Rechercher des personnes liées aux thèses">
      <v-icon size="50" color="secondary">mdi-account-multiple</v-icon>
      <span class="title">
        <h2>
          {{ $t("toutesPersonnes") }}
        </h2>
        <h3 :class="selected === 'personnes' ? 'selected' : ''">{{ $t("toutesPersonnesSubtitle") }}</h3>
      </span>
    </v-btn>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

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

  .v-btn {
    flex: 0 1 48%;
    display: flex;
    height: 100%;
    background-color: transparent;
    padding: 0;

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

  .v-divider {
    color: #0b2134;
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

h3 {
  font-size: 0.875rem;
  letter-spacing: normal;
  font-weight: 400;
  text-transform: none;
}
</style>