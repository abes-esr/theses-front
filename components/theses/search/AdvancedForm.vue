<template>
    <div>
        <v-form id="form" ref="form">
            <div :class="whiteContainer ? 'white-containers' : ''">
                <span class="switch"><span class="switch-text">Opérateur entre les champs</span> <span
                        class="switch-text pl-4">ET</span><v-switch inset flat class="pl-4"
                        v-model="operatorModel"></v-switch><span class="switch-text pl-4">OU</span></span>
                <div v-for="(field, index) in formFields" :key="index" class="form-row">
                    <div class="type">
                        <v-select density="compact" v-model="field.type" :items="types" item-title="titre"
                            item-value="value" label="Champ" variant="plain" single-line menu-icon="mdi-chevron-down"
                            @update:model-value="clearField(index)"></v-select>
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
                                menu-icon="mdi-chevron-down" single-line></v-select>
                        </div>
                        <div v-else>
                            <v-text-field density="compact" v-model="field.value" label="Texte à rechercher"
                                variant="outlined" single-line clearable clear-icon="mdi-close"
                                @keydown.enter="search"></v-text-field>
                        </div>
                    </div>
                    <div class="removeButton">
                        <v-btn @click="removeField(index)" v-if="formFields.length > 1"
                            variant="plain"><v-icon>mdi-close</v-icon></v-btn>
                    </div>
                    <v-divider></v-divider>
                </div>
                <div class="buttons space-between">
                    <v-btn color="primary" density="compact" variant="plain" :title='$t("vider")' @click="clear"
                        prepend-icon="mdi-reload">{{
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
                <v-btn @click="search" flat color="primary" density="compact" class="mr-4">{{ $t("rechercher")
                }}</v-btn>
            </div>
        </v-form>
    </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
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

const operatorModel = ref(false);
const operator = computed(() => {
    return operatorModel.value ? 'OU' : 'ET'
})

onMounted(() => {
    formFields.value.forEach((field) => {
        if (field.type === "dateSoutenance" || field.type === "datePremiereInscriptionDoctorat") {
            //On découpe le champ date qui contient dateFrom et dateTo concaténées, pour peupler dateTo et dateFrom
            let dates = field.value.match(/\[(.*?) TO (.*?)\]/);

            if (dates && dates.length >= 3) {
                dateFrom.value = dates[1];
                dateTo.value = dates[2];
            }
        }
    })
})

const types = ref([
    { titre: 'Titre', value: 'titrePrincipal' },
    { titre: 'Mots clés', value: 'sujetsLibelle' },
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

const formFields = useState("formFields", () => [
    { value: '', type: 'titrePrincipal' },
    { value: '', type: 'sujetsLibelle' },
    { value: '', type: 'discipline' },
]);

function addField() {
    formFields.value.push({ value: '', type: 'titrePrincipal' });
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
    let result = "";

    formFields.value.forEach((field, index) => {
        if (field.value === "") {
            result += " ";
        } else {
            result += ` ${field.type}:(${field.value})`;

            //Cas particulier : pour les mots clés on ajoute également les rameaux
            if (field.type === "sujetsLibelle") result += ` OU sujetsRameauLibelle:(${field.value}))`;

            if (index !== formFields.value.length - 1) {
                result += ` ${operator.value}`;
            }
        }
    });

    return deleteEndOperator(result.replaceAll('status:(accessible)', 'accessible:oui').replace('sujetsLibelle', '(sujetsLibelle').trim());
}

function deleteEndOperator(texte) {
    if (texte.endsWith(" ET") || texte.endsWith(" OU")) {
        return texte.slice(0, - 3);
    } else {
        return texte;
    }
}

watch(dateFrom, () => {
    formFields.value.forEach((field) => {
        if (field.type === "dateSoutenance" || field.type === "datePremiereInscriptionDoctorat") {
            field.value = '[' + dateFrom.value + ' TO ' + dateTo.value + ']';
        }
    });
})

watch(dateTo, () => {
    formFields.value.forEach((field) => {
        if (field.type === "dateSoutenance" || field.type === "datePremiereInscriptionDoctorat") {
            field.value = '[' + dateFrom.value + ' TO ' + dateTo.value + ']';
        }
    });
})


function clear() {
    for (const element of formFields.value) {
        element.value = '';
    }
}

function clearField(index) {
    formFields.value[index].value = "";
}
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.form-row {
    display: grid;
    grid-template-columns: 250px auto 20px;
    gap: 10px;

    @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
        grid-template-columns: 4fr 1fr;
        margin-bottom: 10px;
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

.text {
    @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
        grid-row-start: 2;
        grid-row-end: 3;
        grid-column-start: 1;
        grid-column-end: 2;

    }
}

.removeButton {
    display: flex;
    justify-content: center;

    @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
        grid-row-start: 2;
        grid-row-end: 3;
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
        grid-row-start: 3;
        grid-row-end: 1;
        grid-column-start: 1;
        grid-column-end: 3;

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

    @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
        justify-content: center;
    }
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

.switch {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;

    @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
        margin-bottom: 20px;
    }
}

.switch-text {
    opacity: 0.8;
    font-weight: 600;
    color: rgb(var(--v-theme-primary));
}

.v-switch {
    max-width: 60px;
    max-height: 60px;
}

:deep(.v-switch__thumb) {
    color: rgb(var(--v-theme-surface)) !important;
}

:deep(.v-switch__track) {
    color: rgb(11, 33, 52) !important;
}
</style>