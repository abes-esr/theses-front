<template>
    <v-card flat class="card-container">
        <div class="firstHalf" @click="$router.push({ name: 'these', params: { id: id } })">
            <v-card-title>
              <div class="card-title-wrapper line-clamp">
                <div class="thesis-icon">
                  <span v-if="status === 'enCours'">
                    <img alt="$t('resultCard.ongoing')" id="logoIMG" src="@/assets/these-en-cours-icone-min.svg" />
                  </span>
                  <span v-else-if="status === 'soutenue'">
                    <img alt="$t('resultCard.defended')" id="logoIMG" src="@/assets/these-soutenue-icone-min.svg" />
                  </span>
                </div>
                <div class="card-title">
                  {{ titre }}
                </div>
                <div class="card-title-date">
                  <span class="card-text-bold" v-if="date">
                    {{ date.slice(-4) }}
                  </span>
                  <span v-else>
                    &nbsp;
                  </span>
                </div>
              </div>
            </v-card-title>
        </div>
        <div class="vertical-spacer">

        </div>
        <div class="secondHalf">
            <v-card-text class="py-2 card-text-wrapper">
              <span class="card-text">
                {{ $t('resultCard.par') }}&nbsp;
              </span>

              <span v-for="(item, index) in auteur" :key="item.ppn">
                <span class="card-text">{{ item.prenom }}&nbsp;</span>
                <span class="card-text-bold">{{ item.nom }}&nbsp;</span>
                <span v-if="index < auteur.length - 2">
                  ,&nbsp;
                </span>
                <span v-else-if="index === auteur.length - 2" class="card-text">
                  {{ $t('theseView.et') }}
                </span>
              </span>

              <span class="card-text">
                {{ $t('resultCard.dir') }}&nbsp;
              </span>

              <span v-for="(item, index) in directeurs" :key="item.ppn">
                <span class="card-text">
                  {{ item.prenom }}&nbsp;
                </span>
                <span class="card-text-bold">
                  {{ item.nom }}
                </span>
                <span v-if="index < directeurs.length - 2">
                  ,&nbsp;
                </span>
                <span v-else-if="index === directeurs.length - 2" class="card-text">
                  {{ $t('theseView.et') }}
                </span>
              </span>
              <span class="card-text-bold">
              - {{ discipline }} - {{ etab }}
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
        type: String,
        default: 'Université'
    },
    id: {
        type: String
    },
    status: {
        type: String,
        default: 'soutenue'
    }

})
</script>

<style scoped lang="scss">
.card-container {
  display: flex;
  flex-direction: column;
}

.card-title-wrapper {
  display: grid !important;
  grid-template-columns: 1fr 20fr 1fr;
}

.line-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.thesis-icon {
  grid-column-start: 1;
}

.card-title-date {
  grid-column-start: 3;
  display: flex;
  justify-content: right;
}

.v-card {
  border: solid 1px rgb(var(--v-theme-gris-fonce)) !important;
  min-height: 150px !important;
}

:deep(.v-card-title) {
  white-space: pre-line !important;
  cursor: pointer;
}

.vertical-spacer {
  flex: 1;
}

.secondHalf {
  background-color: rgb(var(--v-theme-gris-clair)) !important;
  padding-top: 6px;
  width: 100%;
}

.subtitle {
  font-size: 0.9rem;
  font-weight: 400;
}

.card-title, .card-text-bold {
  color: rgb(var(--v-theme-primary));
}

.card-text .card-text-bold {
  white-space: unset !important;
  font-size: 15px;
}

.card-title {
  grid-column-start: 2;
  padding: 0 10px 0;
  font-size: 18px;
  font-family: Roboto-Regular, sans-serif;
  font-weight: 600;
}

.card-text {
  color: rgb(var(--v-theme-text-dark-blue));
  font-family: Roboto-Regular, sans-serif;
  font-weight: 500;
}

.card-text-bold {
  font-family: Roboto-Bold, sans-serif;
  font-weight: 700
}

.card-text-wrapper {
  display: inline-block;
}
</style>