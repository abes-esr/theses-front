<template>
    <v-card flat>
        <div class="firstHalf">
            <v-card-title>
                <v-row>
                    <v-col cols="9" md="10"><span class="line-clamp">{{ item.nom }}</span></v-col>
                    <v-col cols="3" md="2">
                        <v-row class="pr-2 pt-2 justify-end">{{ item.prenom }}</v-row>
                        <v-row class="pt-5 pr-1 justify-end">
                            <v-btn flat size="small" append-icon="mdi-arrow-right-bold-circle-outline" color="primary">
                                Voir</v-btn>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="9" md="10" class="pt-1"><span class="line-clamp subtitle"></span>
                    </v-col>
                </v-row>

            </v-card-title>
        </div>
        <div class="secondHalf">
        </div>
    </v-card>
</template>
<script>
export default {
  name: "personnes-card",
};
</script>
<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.line-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.v-card {
    border: solid 1px rgb(var(--v-theme-gris-fonce));
    height: 200px;
}

:deep(.v-card-title) {
    white-space: break-spaces !important;
    font-size: 1rem;
}

.firstHalf {
    height: 70%;
    width: 100%;
}

.secondHalf {
    background-color: rgb(var(--v-theme-gris-clair)) !important;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 30%;
}

.subtitle {
    font-size: 0.9rem;
    font-weight: 400;
}
</style>