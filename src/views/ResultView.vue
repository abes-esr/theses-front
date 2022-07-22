<template>
    <div class="pa-8">
        <h1> {{ JSON.parse(this.result).length }} résultats de thèses pour : {{ request }}</h1>
        <v-row>
            <v-col v-for="item in JSON.parse(result)" :key="item._source" cols="12" xs="12" md="4">
                <result-card :titre="item._source.titre" :description="item._source.abstractFR"
                    :date="item._source.dateSoutenance">
                </result-card>
            </v-col>
        </v-row>
        <v-row>
            <a @click="$router.push({ path: '/' })" href="#" class="pt-10">Retour à la page d'accueil</a>
        </v-row>
    </div>
</template>

<script>

import ResultCard from '../components/ResultCard.vue'

export default {
    components: {
        ResultCard
    },
    props: {
        result: String,
        request: String
    }
}
</script>

<style scoped>
</style>