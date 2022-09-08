<template>
    <v-card>
        <v-card-title>{{ titre }}</v-card-title>
        <v-card-text>{{ description }}</v-card-text>
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
.v-card-text {
    max-height: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>