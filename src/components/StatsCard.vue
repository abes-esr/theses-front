<template>
    <v-card flat>
        <v-card-title class="d-flex justify-center pb-1">
            <h3> {{ titre }} </h3>
        </v-card-title>
        <v-card-subtitle class="d-flex justify-center">{{ description }}</v-card-subtitle>
        <v-card-text class="d-flex justify-center pt-1 pb-4">{{ date }}</v-card-text>
        <a href="#" style="text-decoration: none;">
            <v-row class="pa-0 pb-5 ma-0 d-flex justify-center">
                <h4>EXPLORER</h4>
                <v-icon color="orange-abes" class="pl-2">mdi-arrow-right-circle</v-icon>
            </v-row>
        </a>
    </v-card>
</template>


<script setup>
defineProps({
    titre: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    date: {
        type: String,
        default: ''
    },
})
</script>

<style scoped>
.v-card {
    border: solid 1px #b3b2b4;
}
</style>