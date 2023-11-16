<template>
  <v-card flat class="card-container">
    <NuxtLink class="icon" v-if="!mobile" :to="{ name: 'id', params: { id: linkId } }">
      <IconsIconPersonne></IconsIconPersonne>
    </NuxtLink>
    <NuxtLink :to="{ name: 'id', params: { id: linkId } }">
      <div class="nom-card">
        <div class="nomprenom">
          <span class="prenom">{{ item.prenom + "\xa0" }}</span><span class="nom">{{ item.nom }}</span>
        </div>
      </div>
    </NuxtLink>
    <div class="idref-container">
      <a v-if="item.has_idref" :href="`https://www.idref.fr/${item.id}`" target="_blank"
        title="Accéder à IdRef, le référentiel des personnes et des structures">
        <img alt="logo" id="logoIdref" src="@/assets/idref-icone.png" />
      </a>
    </div>
    <div class="role-personne">
      <NuxtLink :to="{ name: 'id', params: { id: linkId } }">
        {{
          $t('personnes.resultView.personnesCard.auteur') }}&nbsp;({{ item.roles["auteur"] ? item.roles["auteur"] : 0 }})
        &nbsp;|&nbsp; {{
          $t('personnes.resultView.personnesCard.directeur') }}&nbsp;({{ item.roles["directeur de thèse"] ?
    item.roles["directeur de thèse"] : 0 }}) &nbsp;|&nbsp;
        {{
          $t('personnes.resultView.personnesCard.rapporteur') }}&nbsp;({{ item.roles["rapporteur"] ?
    item.roles["rapporteur"]
    : 0 }})</NuxtLink>
    </div>
    <div class="disciplines">
      <NuxtLink :to="{ name: 'id', params: { id: linkId } }">

        <template v-for="(name, index) in item.disciplines" :key="name">
          {{ name }}<span v-if="index !== item.disciplines.length - 1">{{ "\xa0" }};{{ "\xa0" }}</span>
        </template>
        <span>{{ "\xa0" + "|" + "\xa0" }}</span>
        <template v-for="(name, index) in item.etablissements " :key="name">
          {{ name }}<span v-if="index !== item.etablissements.length - 1">{{ "\xa0" }};{{ "\xa0" }}</span>
        </template>
      </NuxtLink>
    </div>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';
import { useDisplay } from "vuetify";

const router = useRouter();
const currentRoute = useRoute();
const { mobile } = useDisplay();

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

const linkId = computed(() => {
  return props.item.id ? props.item.id
    : props.item.these ? props.item.these : "#";
});

</script>

<style scoped lang="scss">
@use 'vuetify/settings';

a {
  text-decoration: none;
  color: inherit;
}

.card-container {
  display: grid;
  grid-template-columns: 60px 10fr 2fr;
  grid-template-rows: 1.5em auto auto;

  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 10px;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    grid-template-rows: auto auto auto;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 5px;
  }
}

.icon {
  grid-row-start: 1;
  grid-row-end: 3;
}

.nom-card {
  margin-top: -5px;
  line-height: 1.3;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    grid-column-start: 1;
    grid-column-end: 3;
  }
}

.idref-container {

  display: grid;
  grid-row-start: 1;
  grid-row-end: 2;
  grid-column-start: 3;
  grid-column-end: 4;

  z-index: 99999;

  a {
    justify-self: end;
  }

  img {
    max-height: 45px;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
      max-height: 30px !important;
    }
  }


}

.disciplines {
  grid-column-start: 1;
  grid-column-end: 4;
  grid-row-start: 3;
  grid-row-end: 4;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    font-size: 0.9em;
  }
}


.role-personne {
  grid-row-start: 2;
  grid-column-start: 2;
  font-weight: 500;
  color: rgb(var(--v-theme-secondary-darken-2));

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    font-size: 0.8em;
    grid-column-start: 1;
    grid-column-end: 3;
  }

}
</style>