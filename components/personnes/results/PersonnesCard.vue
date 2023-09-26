<template>
  <v-card flat class="card-container">
    <div class="first-half">
      <div class="info">
        <!-- <v-icon size="40px">$personne</v-icon>-->
        <div class="nom-card">
          <NuxtLink class="nomprenom"
            :to="{ name: 'id', params: { id: item.id }, query: { 'domaine': currentRoute.query.domaine } }"
            v-if="item.has_idref">
            <span class="prenom">{{ item.prenom + "\xa0" }}</span><span class="nom">{{ item.nom }}</span>
          </NuxtLink>
          <NuxtLink v-else-if="item.these" class="nomprenom" :to="{ name: 'id', params: { id: item.these } }">
            <span class="prenom">{{ item.prenom + "\xa0" }}</span><span class="nom">{{ item.nom }}</span>
          </NuxtLink>
          <div v-else class="nomprenom">
            <span class="prenom">{{ item.prenom + "\xa0" }}</span><span class="nom">{{ item.nom }}</span>
          </div>
        </div>
      </div>
      <div class="action">
        <div class="idref-container">
          <a class="nomprenom" v-if="item.has_idref" :href="`https://www.idref.fr/${item.id}`" target="_blank">
            <img alt="logo" id="logoIdref" src="@/assets/idref-icone.png" />
          </a>
        </div>
        <div class="action-buttons-container">
          <v-btn :disabled="!item.roles['auteur'] || !item.these" color="secondary-darken-2"
            append-icon="mdi-arrow-right-circle" @click="goToPersonne('#Auteurs')">{{
              $t('personnes.resultView.personnesCard.auteur') }}
            ({{ item.roles["auteur"] ? item.roles["auteur"] : 0 }})
          </v-btn>
          <v-btn :disabled="!item.roles['directeur de thèse'] || !item.these" color="secondary-darken-2"
            append-icon="mdi-arrow-right-circle" @click="goToPersonne('#Directeurs')">{{
              $t('personnes.resultView.personnesCard.directeur') }}
            ({{ item.roles["directeur de thèse"] ? item.roles["directeur de thèse"] : 0 }})
          </v-btn>
          <v-btn :disabled="!item.roles['rapporteur'] || !item.these" color="secondary-darken-2"
            append-icon="mdi-arrow-right-circle" @click="goToPersonne('#Rapporteurs')">{{
              $t('personnes.resultView.personnesCard.rapporteur') }}
            ({{ item.roles["rapporteur"] ? item.roles["rapporteur"] : 0 }})
          </v-btn>
        </div>
      </div>
    </div>
    <div class="vertical-spacer"></div>
    <div class="second-half">
      <template v-for="(name, index) in item.disciplines" :key="name">
        {{ name }}<span v-if="index !== item.disciplines.length - 1">{{ "\xa0" }};{{ "\xa0" }}</span>
      </template>
      <span>{{ "\xa0" + "|" + "\xa0" }}</span>
      <template v-for="(name, index) in item.etablissements " :key="name">
        {{ name }}<span v-if="index !== item.etablissements.length - 1">{{ "\xa0" }};{{ "\xa0" }}</span>
      </template>
    </div>
  </v-card>
</template>

<script setup>
const router = useRouter();
const currentRoute = useRoute();

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

function goToPersonne(hash) {
  if (props.item.has_idref) {
    router.push({
      name: 'id',
      query: { 'domaine': currentRoute.query.domaine },
      params: { "id": props.item.id },
      hash: hash ? hash : ''
    });
  } else {
    router.push({
      name: 'id',
      params: { "id": props.item.these.id }
    });
  }
}
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

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

.first-half {
  display: grid;
  grid-template-columns: 4fr 6fr;
  padding: 0 2rem 0 1rem;
  justify-content: space-between;
  align-items: center;
  height: calc(100% + 180px);
  width: 100%;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
    height: 100%;
    flex-direction: row;
    flex-wrap: nowrap;
  }

  .info {
    width: 100%;
    flex: 0 0 10%;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;

    @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
      flex: 1 0 30%;
    }

    .v-icon {
      margin-right: 1rem;
      flex: 0 0 10%;
      align-self: start;
    }

    .sep {
      height: 40px;
      margin-right: 1rem;

      hr {
        border-color: rgb(var(--v-theme-primary));
        opacity: 1;
        border-width: 0 1.5px 0 0;
      }
    }

    a {
      img {
        max-height: 45px;
      }
    }
  }

  .action {
    display: flex;
    justify-content: flex-end;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
      grid-row-start: 2;
      grid-column-start: 1;
      margin-top: 1em;
      justify-content: center;
    }

    .idref-container {
      display: flex;
      align-items: center;

      img {
        max-height: 45px;
      }

      @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
        order: 2;
        width: 50%;
        justify-content: center;
        margin-left: 1em;
      }
    }

    .action-buttons-container {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      align-content: center;
      justify-content: flex-start;
      height: 100px;

      @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
        justify-content: flex-end;
      }

      .v-btn {
        max-height: 30px;
        min-width: 166px;
        font-weight: 500;
        text-transform: none;
        padding: 0 8px;
        margin-left: 0;
        margin-bottom: 0.3rem;
        margin-right: 1rem;

        @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
          margin-left: 1rem;
          margin-right: 0rem;
        }
      }
    }

  }
}

.vertical-spacer {
  flex: 1;
}

.second-half {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  padding: 0.5rem;
  font-weight: bold;
  color: rgb(var(--v-theme-primary));

  @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
    padding: 0rem 1rem 0.5rem;

    hr {
      height: 20px;
      border-color: rgb(var(--v-theme-primary)) !important;
      opacity: 1;
      border-width: 0 1.5px 0 0;
    }
  }

  .disciplines {
    margin-right: 0.5em;
  }
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