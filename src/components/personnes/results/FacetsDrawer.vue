<template>
  <div class="facets">
        <v-expansion-panels rounded class="pb-4">
            <v-expansion-panel>
                <v-expansion-panel-title>
                    DATE
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    Le date picker n'est pas dispo dans la V3.0 de Vuetify ¯\_(ツ)_/¯
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels rounded class="pb-4">
            <v-expansion-panel>
                <v-expansion-panel-title>
                    ETABLISSEMENTS
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-checkbox label="ABES"></v-checkbox>
                    <v-checkbox label="ENSIB"></v-checkbox>
                    <v-checkbox label="Université de Montpellier"></v-checkbox>
                    <v-checkbox label="Université Montpellier III"></v-checkbox>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels rounded class="pb-4">
            <v-expansion-panel>
                <v-expansion-panel-title>
                    LANGUE
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-checkbox label="Français"></v-checkbox>
                    <v-checkbox label="Anglais"></v-checkbox>
                    <v-checkbox label="Espagnol"></v-checkbox>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels rounded class="pb-4">
            <v-expansion-panel>
                <v-expansion-panel-title>
                    DOMAINES
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-checkbox label="Informatique"></v-checkbox>
                    <v-checkbox label="Littérature"></v-checkbox>
                    <v-checkbox label="Chimie"></v-checkbox>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
  </div>
</template>
<style scoped lang="scss">
@use 'vuetify/settings';

.facets {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-top: 2rem;

  .v-expansion-panels {
    width: 80%;
  }
}


</style>