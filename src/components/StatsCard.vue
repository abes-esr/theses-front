<template>
    <v-card>
        <v-card-title> {{ titre }}</v-card-title>
        <v-card-subtitle>{{ description }}</v-card-subtitle>
        <v-card-text>{{ date }}</v-card-text>
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

</style>