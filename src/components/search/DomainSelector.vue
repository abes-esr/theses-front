<template>
    <div>
        <v-row class="pb-4">
            <v-col cols="0" md=""></v-col>
            <v-col cols="11" md="3" class="clickable" @click="select('theses')">
                <v-row v-if="!compact" class="justify-center">
                    <v-icon size="50" color="secondary">mdi-school</v-icon>
                </v-row>
                <v-row class="justify-center pt-3">
                    <h2 :class="selected === 'theses' ? 'selected' : ''">{{ $t("toutesTheses") }}</h2>
                </v-row>
            </v-col>
            <v-divider vertical class="mt-2 mb-2 d-none d-md-block"></v-divider>
            <v-col cols="11" md="3" class="clickable" @click="select('personnes')">
                <v-row v-if="!compact" class="justify-center">
                    <v-icon size="50" color="secondary">mdi-account-multiple</v-icon>
                </v-row>
                <v-row class="justify-center pt-3">
                    <h2 :class="selected === 'personnes' ? 'selected' : ''">
                        {{ $t("personnes") }}
                    </h2>
                </v-row>
            </v-col>
            <v-col cols="0" md="3"></v-col>
        </v-row>
    </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
    compact: {
        type: Boolean
    }
})

const emit = defineEmits(['select'])

let selected = ref('theses');

function select(selection) {
    selected.value = selection;
  emit('select', selected.value);
}
</script>

<style scoped>
.selected {
    border-bottom: solid 5px rgb(var(--v-theme-orange-abes));
}
</style>