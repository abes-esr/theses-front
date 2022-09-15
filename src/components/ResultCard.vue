<template>
    <v-badge location="bottom right" floating content="Soutenue"></v-badge>
    <v-card flat>
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

.v-card {
    border: solid 1px rgb(var(--v-theme-gris-clair));
}

:deep(.v-badge__badge) {
    overflow: visible;
    z-index: 3000;
}
</style>