<template>
    <div>
        <v-form>
            <div v-for="(field, index) in formFields" :key="index" class="form-row">
                <div class="type">
                    <v-select v-model="field.type" :items="types" item-title="titre" item-value="value" label="Champ"
                        variant="outlined"></v-select>
                </div>
                <div class="text">
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

const emit = defineEmits(['search']);


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
            if (index === formFields.value.length - 1) {
                return `${field.type}:${field.value}`;
            } else {
                return `${field.type}:${field.value} ${field.operator}`;
            }
        })
        .join(' ');
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