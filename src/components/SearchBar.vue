<template>
    <v-col>
        <v-text-field clearable label="Recherche" v-model="request" type="text" variant="outlined">
            <template v-slot:append>
                <v-btn color="primary" text @click="search" :loading="loading" class="pa-0 ma-0">
                    <v-icon large>mdi-magnify</v-icon>
                </v-btn>
            </template>
        </v-text-field>
    </v-col>
</template>

<script>
export default {
    name: 'searchBar',
    props: {
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            request: ''
        }
    },

    methods: {
        search() {
            this.$emit('search', this.request);
        }
    }
}
</script>

<style scoped>
:deep(.v-input--horizontal .v-input__append) {
    padding: 0 !important;
    margin: 0 !important;
    height: 100% !important;
}
</style>