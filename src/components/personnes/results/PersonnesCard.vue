<template>
  <v-card flat>
    <div class="firstHalf">
      <div class="info">
        <div class="nom-card">
          <v-icon size="40px">$personne</v-icon>
          <RouterLink class="nomprenom"
                      :to="{ name: 'personne', params: { id: item.id }, query:{ 'domaine': currentRoute.query.domaine }}"
                      v-if="item.has_idref">
            <span class="prenom">{{ item.prenom }}</span>
            <span class="nom">{{ item.nom }}</span>
          </RouterLink>
          <RouterLink v-else-if="item.these.nnt" class="nomprenom"
                      :to="{ name: 'these', params: { id: item.these.nnt } }">
            <span class="prenom">{{ item.prenom }}</span>
            <span class="nom">{{ item.nom }}</span>
          </RouterLink>
          <div v-else class="nomprenom">
            <span class="prenom">{{ item.prenom }}</span>
            <span class="nom">{{ item.nom }}</span>
          </div>
        </div>
        <v-divider vertical></v-divider>
        <a v-if="item.has_idref" :href="`https://www.idref.fr/${item.id}`" target="_blank">
          <img alt="logo"
               id="logoIMG" src="@/assets/idref-icone.png"/>
        </a>
      </div>
      <div class="action">
        <v-btn v-if="item.roles['auteur'] > 0" color="primary" append-icon="mdi-arrow-right-circle"
               @click="goToPersonne('#Auteurs')">{{ $t('personnes.resultView.personnesCard.auteur') }}
          ({{ item.roles["auteur"] }})
        </v-btn>
        <v-btn v-if="item.roles['directeur de thèse'] > 0" color="primary" append-icon="mdi-arrow-right-circle"
               @click="goToPersonne('#Directeurs')">{{ $t('personnes.resultView.personnesCard.directeur') }}
          ({{ item.roles["directeur de thèse"] }})
        </v-btn>
        <v-btn v-if="item.roles['rapporteur'] > 0" color="primary" append-icon="mdi-arrow-right-circle"
               @click="goToPersonne('#Rapporteurs')">{{ $t('personnes.resultView.personnesCard.rapporteur') }}
          ({{ item.roles["rapporteur"] }})
        </v-btn>
      </div>
    </div>
    <div class="vertical-spacer"></div>
    <div class="secondHalf">
      <div class="disciplines">
        <template v-for="name in item.disciplines" :key="name">
          {{ name }}<span class="separator">, </span>
        </template>
      </div>
      <v-divider vertical></v-divider>
      <div class="etablissements">
        <template v-for="name in item.etablissements " :key="name">
          {{ name }}<span class="separator">, </span>
        </template>
      </div>
    </div>
  </v-card>
</template>
<script>
export default {
  name: "personnes-card",
};
</script>
<script setup>
import {useRoute, useRouter} from "vue-router";

const router = useRouter();
const currentRoute = useRoute();

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

function goToPersonne(hash) {
  router.push({
    name: 'personne',
    query: {'domaine': currentRoute.query.domaine},
    params: {"id": props.item.id},
    hash: hash ? hash : ''
  })
}
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.v-card {
  border: solid 1px rgb(var(--v-theme-gris-fonce));
  max-width: 100vw;
  display: flex;
  flex-direction: column;
}


.firstHalf {
  display: flex;
  padding: 1rem;
  justify-content: space-between;
  align-items: center;
  height: 170px;
  width: 100%;
  flex-direction: column;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
    height: 100%;
    flex-direction: row;
    flex-wrap: nowrap;
  }

  .info {
    width: 100%;
    flex: 0 0 10%;
    display: flex;
    justify-content: space-between;
    align-items: center;


    @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
      flex: 1 0 30%;
      max-width: 35%;
    }

    .nom-card {
      display: flex;
      align-items: center;

      .v-icon {
        margin-right: 1rem;
      }

      .nomprenom {
        text-decoration: none;
        color: rgb(var(--v-theme-primary));
        font-size: 23.5px;

        @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
          font-size: 29.5px;
        }

        .prenom {
          font-weight: 400;
        }

        .nom {
          margin-left: 0.5rem;
          font-weight: 700;
        }
      }
    }

    hr {
      border-color: rgb(var(--v-theme-primary));
      opacity: 1;
      border-width: 0 1.5px 0 0;
    }

    a {
      img {
        max-height: 30px;
      }
    }
  }

  .action {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    flex-wrap: wrap;

    @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
      flex: 0 1 40%;
      align-items: flex-start;
    }

    .v-btn {
      max-height: 30px;
      font-weight: 500;
      text-transform: none;
      padding: 0 8px;
    }
  }
}

.vertical-spacer {
  flex: 1;
}

.secondHalf {

  justify-content: space-between;
  align-items: center;
  background-color: rgb(var(--v-theme-gris-clair)) !important;
  height: 100%;
  padding: 0.5rem;
  font-weight: bold;
  color: rgb(var(--v-theme-primary));

  @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
    display: flex;
    padding: 0.5rem 5rem 0.5rem 5rem;

    hr {
      height: 40px;
      border-color: rgb(var(--v-theme-primary)) !important;
      opacity: 1;
      border-width: 0 1.5px 0 0;
    }
  }

  .disciplines, .etablissements {
    flex: 0 0 45%;

    .separator:last-of-type {
      display: none;
    }
  }

}

.subtitle {
  font-size: 0.9rem;
  font-weight: 400;
}
</style>