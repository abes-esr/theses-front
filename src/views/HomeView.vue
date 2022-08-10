<template>
  <v-container class="justify-center">
    <v-row class="justify-center">
      <h1>Le moteur de recherche des thèses françaises</h1>
    </v-row>
    <v-row class="justify-center ma-0 pa-0">
      <v-col cols="12" xs="12" xl="6">
        <search-bar @search="search" :loading="loading" />
      </v-col>
    </v-row>
    <v-row class="justify-center ma-0 pa-0">
      <v-col cols="12" md="3" xs="12">
        <stats-card titre="546 000" description="thèses référencées" date="au 03/06/2022"></stats-card>
      </v-col>
      <v-col cols="12" md="3" xs="12">
        <stats-card titre="79 000" description="thèses en préparation" date="au 03/06/2022"></stats-card>
      </v-col>
      <v-col cols="12" md="3" xs="12">
        <stats-card titre="805 000" description="personnes référencées" date="au 03/06/2022"></stats-card>
      </v-col>
    </v-row>
    <v-row>
      <p>Le PoC fédé est accessible ici : <a href="/poc-fede/">poc-fede</a></p>
    </v-row>
  </v-container>
</template>

<script>
import searchBar from '../components/SearchBar.vue'
import axios from 'axios'
import statsCard from '../components/StatsCard.vue'

export default {
  components: {
    searchBar,
    statsCard
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    search(payload) {
      this.loading = true;
      axios.post(import.meta.env.VITE_APP_API, {
        "query": {
          "bool": {
            "must": {
              "query_string": {
                "query": payload
              }
            }
          }
        }
      }).then(response => {
        this.$router.push({
          name: 'resultats',
          params: {
            result: JSON.stringify(response.data.hits.hits),
            request: payload
          }
        })
      }).catch(error => {
        console.log(error)
      }).finally(() => {
        this.loading = false;
      })
    }
  },

}
</script>
