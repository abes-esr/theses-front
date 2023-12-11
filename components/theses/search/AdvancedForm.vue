<template>
    <div>
        <v-form id="form" ref="form">
            <div :class="whiteContainer ? 'white-containers' : ''">
                <div v-for="(field, index) in formFields" :key="index" class="form-row">
                    <div class="type">
                        <v-select density="compact" v-model="field.type" :items="types" item-title="titre"
                            item-value="value" label="Champ" variant="plain" single-line menu-icon="mdi-chevron-down"
                            :rules=requiredRule></v-select>
                    </div>

                    <div class="text">
                        <div v-if="field.type === 'dateSoutenance' || field.type === 'datePremiereInscriptionDoctorat'">
                            <span class="calendars">
                                <span class="calendar-text pr-4">Du</span> <vue-date-picker v-model="dateFrom"
                                    :teleport="true" locale="fr" auto-apply :clearable="false" model-type="yyyy-MM-dd"
                                    format="yyyy-MM-dd" :enable-time-picker="false" text-input placeholder="AAAA-MM-JJ"
                                    :start-date="new Date()" min-date="1965-01-01" :max-date="new Date()"
                                    :teleport-center="teleportCenter">
                                </vue-date-picker>
                                <span class="calendar-text px-4">Au</span> <vue-date-picker v-model="dateTo"
                                    :teleport="true" locale="fr" auto-apply :clearable="false" model-type="yyyy-MM-dd"
                                    format="yyyy-MM-dd" :enable-time-picker="false" text-input placeholder="AAAA-MM-JJ"
                                    :start-date="new Date()" :min-date="dateFrom" :max-date="new Date()"
                                    :teleport-center="teleportCenter">
                                </vue-date-picker>
                            </span>
                        </div>
                        <div v-else-if="field.type === 'status'">
                            <v-select density="compact" v-model="field.value"
                                :items="[{ titre: 'Toutes les thèses', value: '*' }, { titre: 'Uniquement les thèses soutenues', value: 'soutenue' }, { titre: 'Uniquement les thèses soutenues accessibles en ligne', value: 'accessible' }, { titre: 'Uniquement les thèses en préparation', value: 'enCours' }]"
                                item-title="titre" item-value="value" label="Champ" variant="outlined"
                                menu-icon="mdi-chevron-down" single-line :rules=requiredRule></v-select>
                        </div>
                        <div v-else>
                            <v-text-field density="compact" v-model="field.value" label="Texte à rechercher"
                                variant="outlined" single-line clearable clear-icon="mdi-close"
                                :rules=requiredRule></v-text-field>
                        </div>
                    </div>

                    <div class="operator">
                        <v-select density="compact" v-if="index < formFields.length - 1" v-model="field.operator"
                            :items="operators" label="Opérateur" variant="plain" single-line menu-icon="mdi-chevron-down"
                            :rules=requiredRule></v-select>
                        <span v-else></span>
                    </div>
                    <div class="removeButton">
                        <v-btn @click="removeField(index)" v-if="formFields.length > 1"
                            variant="plain"><v-icon>mdi-close</v-icon></v-btn>
                    </div>
                    <v-divider></v-divider>
                </div>
                <div class="buttons space-between">
                    <v-btn color="primary" density="compact" variant="plain" :title='$t("vider")' @click="clear"
                        prepend-icon="mdi-close">{{
                            $t("vider") }}</v-btn>
                    <span>
                        <v-btn @click="addField" variant="plain" density="compact" title="Ajouter un champ"
                            icon="mdi-plus"></v-btn>
                    </span>
                </div>
            </div>
            <div class="buttons right">
                <v-btn variant="outlined" density="compact" color="primary" @click="emit('simple')" class="mr-4">{{
                    $t("simple")
                }}</v-btn>
                <v-btn @click="validate" flat color="primary" density="compact" class="mr-4">{{ $t("rechercher")
                }}</v-btn>
            </div>

        </v-form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { useDisplay } from "vuetify";

const emit = defineEmits(['search', 'simple']);

const props = defineProps({
    whiteContainer: {
        type: Boolean,
        default: false
    }
})

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
    { titre: "Date de soutenance", value: "dateSoutenance" },
    { titre: "Date d'inscription en doctorat", value: "datePremiereInscriptionDoctorat" },
    { titre: "Statut", value: "status" }
]);
const operators = ref(['ET', 'OU', 'SAUF']);

const formFields = useState("formFields", () => [
    { value: '', type: 'titrePrincipal', operator: 'ET' },
    { value: '', type: 'titrePrincipal', operator: 'ET' },
    { value: '', type: 'titrePrincipal', operator: 'ET' },
]);

function addField() {
    formFields.value.push({ value: '', type: 'titrePrincipal', operator: 'ET' });
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
                return `${field.type}:(${field.value})`;
            } else {
                return `${field.type}:(${field.value}) ${field.operator}`;
            }
        })
        .join(' ')
        //Cas particulier des status accessible en ligne
        .replaceAll('status:(accessible)', 'accessible:oui')
        //Cas particulier des dates
        .replaceAll('dateSoutenance:()', 'dateSoutenance:[' + dateFrom.value + ' TO ' + dateTo.value + ']')
        .replaceAll('datePremiereInscriptionDoctorat:()', 'datePremiereInscriptionDoctorat:[' + dateFrom.value + ' TO ' + dateTo.value + ']');
    return result.trim();
}


/**
 * Règles de validation du formulaire
 */

const { t } = useI18n();

const requiredRule = [value => {
    if (value) return true;
    return t("reportErrorView.requis");
}];

const form = ref();

function validate() {
    form.value.validate().then((v) => {
        if (v.valid) {
            search();
        }
    });
}

function clear() {
    for (const element of formFields.value) {
        element.operator = 'ET';
        element.type = 'titrePrincipal';
        element.value = '';
    }
    form.value.resetValidation();
}
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.form-row {
    display: grid;
    grid-template-columns: 250px auto 90px 20px;
    gap: 10px;

    @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
        grid-template-columns: 1fr 1fr;
        margin-bottom: 40px;
    }
}

.type {
    @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
        grid-row-start: 1;
        grid-row-end: 2;
        grid-column-start: 1;
        grid-column-end: 3;

    }

    color: rgb(var(--v-theme-primary));
    font-weight: 600 !important;
    max-width: 300px;
}

.type :deep(.v-select) {
    font-weight: 600;
}


.operator :deep(.v-select) {
    font-weight: 600;
}

.operator :deep(.v-field__input) {
    justify-content: center;
}

.text {
    @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
        grid-row-start: 2;
        grid-row-end: 3;
        grid-column-start: 1;
        grid-column-end: 3;

    }
}

.operator {
    max-width: 100px;
    padding-left: 10px;

    @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
        grid-row-start: 3;
        grid-row-end: 4;
        grid-column-start: 1;
        grid-column-end: 3;

        padding-left: unset;

    }
}

.removeButton {
    display: flex;
    justify-content: center;

    @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
        grid-row-start: 3;
        grid-row-end: 4;
        grid-column-start: 2;
        grid-column-end: 3;

        justify-content: flex-end;
    }
}

.v-btn {
    opacity: 1;
}

hr {
    display: none;
    border-color: rgb(var(--v-theme-primary));
    opacity: 0.4;
    border-top: solid 1px;
    margin: 0 6%;


    @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
        display: unset;
        grid-row-start: 4;
        grid-row-end: 5;
        grid-column-start: 1;
        grid-column-end: 4;

        display: flex;
        justify-content: center;
    }
}

.buttons {
    display: flex;
    align-items: center;
    padding-top: 10px;
}

.space-between {
    justify-content: space-between;
}

.right {
    padding-top: 20px;
    justify-content: flex-end;
}

.calendars {
    display: flex;
}

.calendar-text {
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgb(var(--v-theme-primary));
    font-weight: 600;
}

:deep(.dp__main) {
    max-width: 150px;
}

:deep(.dp__input) {
    height: 44px;
    border-color: rgb(var(--v-theme-primary), 0.4);
}

:deep(.dp__input:hover) {
    border-color: rgb(var(--v-theme-primary));
}

.white-containers {
    padding: 20px 20px 10px;
}
</style>