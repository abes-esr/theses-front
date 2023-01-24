<template>
    <v-card flat>
        <v-expansion-panels rounded>
            <v-expansion-panel>
                <v-expansion-panel-title>
                    STATUT
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-checkbox :label="`Soutenues : ${facets.soutenue}`"></v-checkbox>
                    <v-checkbox class="pl-4" :label="`Accessibles en ligne : ${facets.accessible}`"></v-checkbox>
                    <v-checkbox :label="`En préparation : ${facets.enCours}`"></v-checkbox>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-card>
</template>

<script setup>
defineProps({
    facets: {
        type: Object
    }
})
</script>