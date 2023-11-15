<template>
  <v-card flat class="card-container">
    <nuxt-link class="first-half"
       :to="{ path: '/'+id, query: { domaine: route.query.domaine }}"
    >
      <v-card-title>
        <div class="card-title-wrapper line-clamp">
          <div v-if="!mobile" class="thesis-icon">
            <ThesesResultsThesisIcon :status="status"></ThesesResultsThesisIcon>
          </div>
          <div v-if="mobile" class="card-title">
            <ThesesResultsThesisIcon :status="status" :titre="titre"></ThesesResultsThesisIcon>
          </div>
          <div v-else class="card-title">
            {{ titre }}
          </div>
          <div class="card-title-date">
            <span class="card-text-bold card-date-text" v-if="date">
              <p v-if="status !== 'soutenue'">{{ $t('resultCard.since') }}</p>
              <p v-if="!mobile">{{ '\xa0' }}</p>
              <p>{{ date.slice(-4) }}</p>
              <p class="date-spacer"></p>
            </span>
            <span v-else>
              {{ '\xa0' }}
            </span>
          </div>
        </div>
      </v-card-title>
    </nuxt-link>
    <div class="vertical-spacer"></div>
    <div class="second-half">
      <v-card-text class="py-2 card-text-wrapper">
        <span class="card-text">
          {{ $t('resultCard.par') }}{{ '\xa0' }}
        </span>

        <span v-for="(item, index) in auteur" :key="item.ppn ? item.ppn : item.id">
          <nuxt-link :class="item.ppn || item.id ? 'clickable lightblue' : ''" :to="'/' + (item.ppn ? item.ppn : item.id)">
            <span class="card-text">{{ item.prenom }}{{ '\xa0' }}</span>
            <span class="card-text">{{ item.nom }}</span>
          </nuxt-link>{{ '\xa0' }}
          <span v-if="index < auteur.length - 2">
            ,{{ '\xa0' }}
          </span>
          <span v-else-if="index === auteur.length - 2" class="card-text">
            {{ $t('theseView.et') }}
          </span>
        </span>

        <span class="card-text">
          {{ $t('resultCard.dir') }}{{ '\xa0' }}
        </span>

        <span v-for="(item, index) in directeurs" :key="item.ppn ? item.ppn : item.id">
          <nuxt-link :class="item.ppn || item.id ? 'clickable lightblue' : ''" :to="'/' + (item.ppn ? item.ppn : item.id)">
            <span class="card-text">
              {{ item.prenom }}{{ '\xa0' }}
            </span>
            <span class="card-text">
              {{ item.nom }}
            </span>
          </nuxt-link>
          <span v-if="index < directeurs.length - 2">
            ,{{ '\xa0' }}
          </span>
          <span v-else-if="index === directeurs.length - 2" class="card-text">
            {{ $t('theseView.et') }}
          </span>
        </span>
        <span class="card-text-bold">
          - {{ discipline }} - <nuxt-link :class="etabPPN ? 'clickable lightblue' : ''" :to="'/' + etabPPN">{{ etab
          }}</nuxt-link>
        </span>
      </v-card-text>
    </div>
  </v-card>
</template>
<script>
export default {
  name: "result-card",
};
</script>
<script setup>
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();

defineProps({
  titre: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    default: '01/01/2000'
  },
  auteur: {
    type: Array
  },
  directeurs: {
    type: Array
  },
  discipline: {
    type: String,
    default: 'Discipline'
  },
  etab: {
    type: String
  },
  etabPPN: {
    type: String
  },
  id: {
    type: String
  },
  status: {
    type: String,
    default: 'soutenue'
  }

});

const route = useRoute();
const router = useRouter();
function linkTo(id) {
  if (id) router.push("/" + id);
}
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

a, a:visited, a:hover, a:active {
  color: inherit;
  text-decoration: none;
}

.card-container {
  display: flex;
  flex-direction: column;
}

.card-title-wrapper {
  display: grid !important;
  grid-template-columns: 1fr 20fr 3fr;
}

.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.thesis-icon {
  grid-column-start: 1;
  grid-row-start: 1;
}

.card-title {
  grid-column-start: 2;
  padding: 10px 10px 0;
  font-size: 18px;
  font-family: Roboto-Regular, sans-serif;
  font-weight: 500;
  line-height: 1.4rem !important;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    line-height: 1.6rem !important;
    padding: 0;

  }
}

.card-title-date {
  grid-column-start: 3;
  display: flex;
}

.card-date-text {
  width: 100%;
  justify-content: right;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  font-size: 18px;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    flex-wrap: wrap;
    flex-direction: column;
    font-size: 15px;
    text-align: right;
  }
}

.date-spacer {
  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    flex-grow: 4;
  }
}

:deep(.v-card-title) {
  white-space: pre-line !important;
  cursor: pointer;
}

.vertical-spacer {
  flex: 1;
}

.subtitle {
  font-size: 0.9rem;
  font-weight: 400;
}

.card-title {
  color: rgb(var(--v-theme-primary));
}

.card-text .card-text-bold {
  white-space: unset !important;
  font-size: 15px;
}

.card-text {
  font-family: Roboto-Regular, sans-serif;
}

.card-text-bold {
  font-family: Roboto-Bold, sans-serif;
  font-weight: 700
}

.card-text-wrapper {
  display: inline-block;
}

.clickable {
  cursor: pointer;
  font-weight: bold;
}

.lightblue {
  color: rgb(var(--v-theme-secondary-darken-2)) !important;
}
</style>