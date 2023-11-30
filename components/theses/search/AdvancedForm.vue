<template>
    <div>
        <v-form>
            <div v-for="(field, index) in formFields" :key="index" class="form-row">
                <div class="type">
                    <v-select v-model="field.type" :items="types" item-title="titre" item-value="value" label="Champ"
                        variant="outlined"></v-select>
                </div>
                <div v-if="field.type === 'dateSoutenance' || field.type === 'datePremiereInscriptionDoctorat'">
                    Du <vue-date-picker v-model="dateFrom" :teleport="true" locale="fr" auto-apply :clearable="false"
                        model-type="yyyy-MM-dd" format="yyyy-MM-dd" :enable-time-picker="false" text-input
                        placeholder="yyyy-MM-dd" :start-date="new Date()" min-date="1965-01-01" :max-date="new Date()"
                        :teleport-center="teleportCenter">
                    </vue-date-picker>
                    Au <vue-date-picker v-model="dateTo" :teleport="true" locale="fr" auto-apply :clearable="false"
                        model-type="yyyy-MM-dd" format="yyyy-MM-dd" :enable-time-picker="false" text-input
                        placeholder="yyyy-MM-dd" :start-date="new Date()" :min-date="dateFrom" :max-date="new Date()"
                        :teleport-center="teleportCenter">
                    </vue-date-picker>
                </div>
                <div v-else-if="field.type === 'status'">
                    <v-select v-model="field.value"
                        :items="[{ titre: 'Toutes les thèses', value: '*' }, { titre: 'Uniquement les thèses soutenues', value: 'soutenue' }, { titre: 'Uniquement les thèses soutenues accessibles en ligne', value: 'accessible' }, { titre: 'Uniquement les thèses en préparation', value: 'enCours' }]"
                        item-title="titre" item-value="value" label="Champ" variant="outlined"></v-select>
                </div>
                <div v-else class="text">
                    <v-text-field v-model="field.value" label="Champ de texte" variant="outlined" />
                </div>
                <div class="operator" v-if="index < formFields.length - 1">
                    <v-select v-model="field.operator" :items="operators" label="Opérateur" variant="outlined"></v-select>
                </div>
                <div class="removeButton">
                    <v-btn @click="removeField(index)" v-if="formFields.length > 1" variant="outlined">Supprimer</v-btn>
                </div>
            </div>
            <v-btn @click="addField" variant="outlined">Ajouter un champ</v-btn>
            <v-btn @click="search" variant="outlined">Rechercher</v-btn>

        </v-form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { useDisplay } from "vuetify";

const emit = defineEmits(['search']);

const { mobile } = useDisplay();
const teleportCenter = ref(mobile);

const dateFrom = ref();
const dateTo = ref();

const types = ref([
    { titre: 'Titre', value: 'titrePrincipal' },
    { titre: 'Mot clés', value: 'sujetsLibelle' },
    { titre: 'Mot clés rameaux', value: 'sujetsRameauLibelle' },
    { titre: "Résumé", value: 'resumes.\\*' },
    { titre: "Discipline", value: "discipline" },
    { titre: "Auteur", value: "auteursNP" },
    { titre: "Directeur de thèse", value: "directeursNP" },
    { titre: "Président", value: "presidentJuryNP" },
    { titre: "Rapporteur", value: "rapporteursNP" },
    { titre: "Membre du jury", value: "membresJuryNP" },
    { titre: "Etablissement de soutenance", value: "etabSoutenanceN" },
    { titre: "Etablissement de cotutelle", value: "etabsCotutelleN" },
    { titre: "Ecole doctorale", value: "ecolesDoctoralesN" },
    { titre: "Ecole doctorale", value: "ecolesDoctoralesN" },
    { titre: "Date de soutenance", value: "dateSoutenance" },
    { titre: "Date d'inscription en doctorat", value: "datePremiereInscriptionDoctorat" },
    { titre: "Statut", value: "status" }
]);
const operators = ref(['ET', 'OU']);

const formFields = ref([
    { value: '', type: '', operator: 'ET' },
    { value: '', type: '', operator: 'ET' },
    { value: '', type: '', operator: 'ET' },
]);

function addField() {
    formFields.value.push({ value: '', type: '', operator: '' });
};

function removeField(index) {
    if (formFields.value.length > 1) {
        formFields.value.splice(index, 1);
    }
};

function search() {
    emit('search', objectToQuery())
}

function objectToQuery() {
    const result = formFields.value
        .map((field, index) => {
            //Cas particulier des dates, on les reformate pour ES


            if (index === formFields.value.length - 1) {
                return `${field.type}:${field.value}`;
            } else {
                return `${field.type}:${field.value} ${field.operator}`;
            }
        })
        .join(' ')
        //Cas particulier des status accessible en ligne
        .replaceAll('status:accessible', 'accessible:oui')
        //Cas particulier des dates
        .replaceAll('dateSoutenance:', 'dateSoutenance:[' + dateFrom.value + ' TO ' + dateTo.value + ']')
        .replaceAll('datePremiereInscriptionDoctorat:', 'datePremiereInscriptionDoctorat:[' + dateFrom.value + ' TO ' + dateTo.value + ']');
    return result.trim();
}
</script>

<style scoped>
.form-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.text {
    width: 50%;
}
</style>