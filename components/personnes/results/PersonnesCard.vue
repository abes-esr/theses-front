<template>
<!--  Contenu du label aria permettant de décrire la carte-->
    <div :id="'person-aria-label-' + item.id" aria-hidden="true" style="visibility: hidden; height: 0;">
      {{ item.prenom + ' ' + item.nom }}.
        Rôles :
      {{
        $t('personnes.resultView.personnesCard.auteur') }}&nbsp;({{ item.roles["Auteur / Autrice"] ? item.roles["Auteur / Autrice"] : 0 }})
      &nbsp;|&nbsp;
        {{ $t('personnes.resultView.personnesCard.directeur') }}&nbsp;({{ item.roles["Directeur / Directrice"] ? item.roles["Directeur / Directrice"] : 0 }})
      &nbsp;|&nbsp;
        {{ $t('personnes.resultView.personnesCard.rapporteur') }}&nbsp;({{ item.roles["Rapporteur / Rapporteuse"] ? item.roles["Rapporteur / Rapporteuse"] : 0 }}
      . Disciplines :
      <template v-for="(name, index) in item.disciplines" :key="name">
          {{ name }}
        </template>
      . Etablissements :
        <template v-for="(name, index) in item.etablissements " :key="name">
          {{ name }}
        </template>
    </div>
  <v-card flat class="card-container">
    <NuxtLink aria-hidden="true" tabindex="-1" class="icon" v-if="!mobile" :to="{ name: 'id', params: { id: linkId } }">
      <IconsIconPersonne aria-hidden="true"></IconsIconPersonne>
    </NuxtLink>
    <NuxtLink :aria-labelledby="'person-aria-label-' + item.id" :to="{ name: 'id', params: { id: linkId } }">
      <div class="nom-card">
        <div class="nomprenom">
          <span class="prenom">{{ item.prenom + "\xa0" }}</span><span class="nom">{{ item.nom }}</span>
        </div>
      </div>
    </NuxtLink>
    <div class="idref-container">
      <a v-if="item.has_idref" :href="`https://www.idref.fr/${item.id}`" target="_blank"
        :title="item.prenom  + ' ' + item.nom + ' ' + $t('footer.idRef')" class="idref-logo">
        <img :alt="$t('footer.idRef')" id="logoIdref" :src="'/idref-icone-' + colorMode + '.svg'" />
        <span aria-hidden="true">IdRef</span>
      </a>
    </div>
    <div class="role-personne">
      <NuxtLink aria-hidden="true" tabindex="-1" :to="{ name: 'id', params: { id: linkId } }">
        {{
      $t('personnes.resultView.personnesCard.auteur') }}&nbsp;({{ item.roles["Auteur / Autrice"] ? item.roles["Auteur / Autrice"] : 0 }})
        &nbsp;|&nbsp; {{
      $t('personnes.resultView.personnesCard.directeur') }}&nbsp;({{ item.roles["Directeur / Directrice"] ?
      item.roles["Directeur / Directrice"] : 0 }}) &nbsp;|&nbsp;
        {{
      $t('personnes.resultView.personnesCard.rapporteur') }}&nbsp;({{ item.roles["Rapporteur / Rapporteuse"] ?
      item.roles["Rapporteur / Rapporteuse"]
      : 0 }})</NuxtLink>
    </div>
    <div class="disciplines">
      <NuxtLink aria-hidden="true" tabindex="-1" :to="{ name: 'id', params: { id: linkId } }">
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
import { useColorMode } from '@vueuse/core';

const colorMode = useColorMode();
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
  return props.item.has_idref ? props.item.id
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
      max-width: 30px !important;
    }
  }
}

.disciplines {
  display: grid;
  grid-column-start: 1;
  grid-column-end: 3;
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
    grid-column-end: 4;
  }

}
</style>