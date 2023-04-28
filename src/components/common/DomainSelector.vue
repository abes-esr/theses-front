<template>
  <div class="domain-selector">
    <v-btn flat @click="select('theses')">
      <v-icon size="50" color="secondary">mdi-school</v-icon>
      <h2 :class="selected === 'theses' ? 'selected' : ''">
        {{ $t("toutesTheses") }}
      </h2>
    </v-btn>
    <v-divider vertical></v-divider>
    <v-btn flat @click="select('personnes')">
      <v-icon size="50" color="secondary">mdi-account-multiple</v-icon>
      <h2 :class="selected === 'personnes' ? 'selected' : ''">
        {{ $t("toutesPersonnes") }}
      </h2>
    </v-btn>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

defineProps({
  compact: {
    type: Boolean
  }
});

const selected = ref('theses');
const router = useRouter();
const currentRoute = useRoute();
const emit = defineEmits('changeDomain');

onMounted(() => {
  if (currentRoute.query.domaine) {
    selected.value = currentRoute.query.domaine;
  } else {
    select("theses");
  }
});

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
  }).then(() => {
    emit('changeDomain');
  });
}

</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.domain-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: transparent;
  margin-top: 1rem;

  .v-btn {
    flex: 0 1 48%;
    display: flex;
    height: 100%;
    background-color: transparent;
    padding: 0;

    ::v-deep(.v-btn__content) {
      display: flex;
      flex-direction: column;

      h2 {
        font-weight: 500;
        font-size: 10px;
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
  }
}

.selected {
  text-decoration: underline;
  text-decoration-thickness: 4px;
  text-underline-offset: 8px;
  text-decoration-color: rgb(var(--v-theme-orange-abes));
}
</style>