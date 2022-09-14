<template>
    <v-col>
        <v-text-field clearable label="Recherche" v-model="request" type="text" variant="outlined"
            @keydown.enter="search">
            <template v-slot:append>
                <v-btn color="primary"
                    style="height: 100%; border-bottom-left-radius: 0; border-top-left-radius: 0; margin-left: -10px !important;"
                    text @click="search" :loading="loading" class="pa-0 ma-0">
                    <v-icon large>mdi-magnify</v-icon>
                </v-btn>
            </template>
        </v-text-field>
    </v-col>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search'])

defineProps({
    loading: {
        type: Boolean,
        default: false
    }
})

const request = ref('');

function search() {
    emit('search', request.value);
}


</script>

<style scoped>
:deep(.v-input--horizontal .v-input__append) {
    padding: 0 !important;
    margin: 0 !important;
    height: 100% !important;
}
</style>