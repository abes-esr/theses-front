<template>
    <div>
        <v-form id="form" ref="form">
            <div :class="whiteContainer ? 'white-containers' : ''">
                <span class="switch"><span class="switch-text">{{ $t('advancedSearch.operator') }}</span>
                  <span
                        class="switch-text pl-4">{{ $t('advancedSearch.and') }}</span>
                  <v-switch :aria-label="t('advancedSearch.switch')" inset flat class="pl-4" v-model="operatorModel"></v-switch>
                  <span class="switch-text pl-4">{{ $t('advancedSearch.or') }}</span></span>
                <div v-for="(field, index) in formFields" :key="index" class="form-row">
                    <div class="type">
                        <v-select class="v-field--container" density="compact" v-model="field.type" :items="types" item-title="titre"
                            item-value="value" label="Champ" variant="plain" single-line menu-icon="mdi-chevron-down"
                            @update:model-value="clearField(index)">
                            <template v-slot:item="{ props, index }">
                                <v-list density="compact">
                                    <VListSubheader v-if="index === 1">{{ $t('advancedSearch.thesisInfo') }}</VListSubheader>
                                    <VListSubheader v-if="index === 6">{{ $t('advancedSearch.people') }}</VListSubheader>
                                    <VListSubheader v-if="index === 12">{{ $t('advancedSearch.institutions') }}</VListSubheader>
                                    <VListSubheader v-if="index === 17">{{ $t('advancedSearch.date') }}</VListSubheader>
                                    <v-list-item v-bind="props"></v-list-item>
                                </v-list>
                            </template>
                        </v-select>
                    </div>

                    <div class="text">
                        <div v-if="field.type === 'dateSoutenance' || field.type === 'datePremiereInscriptionDoctorat'">
                            <span class="calendars">
                                <div class="calendar-row advanced-input-fields">
                                    <span class="calendar-text pr-4">Du</span> <vue-date-picker v-model="dateFrom"
                                        :teleport="true" locale="fr" auto-apply :clearable="false"
                                        model-type="yyyy-MM-dd" format="yyyy-MM-dd" :enable-time-picker="false"
                                        text-input placeholder="AAAA-MM-JJ" :start-date="new Date()"
                                        min-date="1965-01-01" :max-date="new Date()">
                                    </vue-date-picker>
                                </div>
                                <div class="calendar-row">
                                    <span class="calendar-text px-4">Au</span> <vue-date-picker v-model="dateTo"
                                        :teleport="true" locale="fr" auto-apply :clearable="false"
                                        model-type="yyyy-MM-dd" format="yyyy-MM-dd" :enable-time-picker="false"
                                        text-input placeholder="AAAA-MM-JJ" :start-date="new Date()"
                                        :min-date="dateFrom" :max-date="new Date()">
                                    </vue-date-picker>
                                </div>
                            </span>
                        </div>
                        <div v-else-if="field.type === 'status'">
                            <v-select density="compact" v-model="field.value" class="advanced-input-fields"
                                :items="[{ titre: 'Toutes les thèses', value: '*' }, { titre: 'Uniquement les thèses soutenues', value: 'soutenue' }, { titre: 'Uniquement les thèses soutenues accessibles en ligne', value: 'accessible' }, { titre: 'Uniquement les thèses en préparation', value: 'enCours' }]"
                                item-title="titre" item-value="value" label="Champ" variant="outlined"
                                menu-icon="mdi-chevron-down" single-line></v-select>
                        </div>
                        <div v-else>
                            <v-text-field density="compact" v-model="field.value" :label="t('advancedSearch.searchText')" class="advanced-input-fields"
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
                        <v-btn @click="addField" variant="plain" density="compact" :title="t('advancedSearch.addField')"
                            icon="mdi-plus"></v-btn>
                    </span>
                </div>
            </div>
            <div class="buttons right">
                <v-btn variant="outlined" density="compact" color="primary" @click="emit('simple')" class="mr-4">{{
                $t("simple") }}</v-btn>
                <v-btn @click="search" flat color="primary" density="compact" class="mr-4">{{ $t("rechercher") }}</v-btn>
            </div>
        </v-form>
    </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { useI18n } from "vue-i18n";

const emit = defineEmits(['search', 'simple']);
const { t } = useI18n();

const props = defineProps({
    whiteContainer: {
        type: Boolean,
        default: false
    }
})

const dateFrom = ref();
const dateTo = ref();

const operatorModel = ref(false);
const operator = computed(() => {
    return operatorModel.value ? 'OU' : 'ET'
})

onMounted(() => {
  createForm();
});

const types = computed(() => {
  return [
    { titre: t("advancedSearch.status"), value: "status" },
    { titre: t("advancedSearch.title"), value: "titres.\\*" },
    { titre: t("advancedSearch.keyword"), value: "sujetsLibelle" },
    { titre: t("advancedSearch.everyKeyword"), value: "sujetsLibelle OU sujetsRameauLibelle OU sujetsRameauPpn" },
    { titre: t("advancedSearch.rameauKeyword"), value: "sujetsRameauLibelle OU sujetsRameauPpn" },
    { titre: t("advancedSearch.abstract"), value: "resumes.\\*" },
    { titre: t("advancedSearch.discipline"), value: "discipline" },
    { titre: t("advancedSearch.allMetaData"), value: "biblio" },
    { titre: t("theseView.auteur"), value: "auteursNP OU auteursPpn" },
    { titre: t("advancedSearch.directeur"), value: "directeursNP OU directeursPpn" },
    { titre: t("advancedSearch.president"), value: "presidentJuryNP OU presidentJuryPpn" },
    { titre: t("advancedSearch.rapporteurs"), value: "rapporteursNP OU rapporteursPpn" },
    { titre: t("advancedSearch.jury"), value: "membresJuryNP OU membresJuryPpn" },
    { titre: t("advancedSearch.ppnPerson"), value: "auteursPpn OU directeursPpn OU presidentJuryPpn OU rapporteursPpn OU membresJuryPpn" },
    { titre: t("advancedSearch.role"), value: "roles" },
    { titre: t("advancedSearch.defenseInstitution"), value: "etabSoutenanceN OU etabSoutenancePpn" },
    { titre: t("advancedSearch.coSupervisionInstitution"), value: "etabsCotutelleN OU etabsCotutellePpn" },
    { titre: t("advancedSearch.doctoralSchool"), value: "ecolesDoctoralesN OU ecolesDoctoralesPpn" },
    { titre: t("advancedSearch.partner"), value: "partenairesRechercheN OU partenairesRecherchePpn" },
    { titre: t("advancedSearch.ppnPartner"), value: "etabSoutenancePpn OU etabsCotutellePpn OU ecolesDoctoralesPpn OU partenairesRecherchePpn" },
    { titre: t("advancedSearch.allInstitutions"), value: "structures" },
    { titre: t("advancedSearch.defenseDate"), value: "dateSoutenance" },
    { titre: t("advancedSearch.inscriptionDate"), value: "datePremiereInscriptionDoctorat" }
  ];
});

// Ici requêtes à transformer lorsqu'elles sont extraites de l'URL pour la correspondance avec le tableau ci-dessus
const typeReplacements = [
  { match: "sujetsRameauLibelle", replaceWith: "sujetsRameauLibelle OU sujetsRameauPpn" },
  // Ajoute ici d'autres remplacements si nécessaire
];


const formFields = useState("formFields", () => [
    { value: '', type: 'titres.\\*' },
    { value: '', type: 'sujetsLibelle' },
    { value: '', type: 'discipline' },
]);


function createForm() {
  const query = useRoute().query.q;

  if(typeof query === "string" && query !== "*" && query !== "") {
    let fieldsFromQuery = queryToObject(query);
    formFields.value = fieldsFromQuery.result;
    operatorModel.value = fieldsFromQuery.operator === "OU";
  }

    formFields.value.forEach((field) => {
      if (field.type === "dateSoutenance" || field.type === "datePremiereInscriptionDoctorat") {
        //On découpe le champ date qui contient dateFrom et dateTo concaténées, pour peupler dateTo et dateFrom
        let dates = field.value.match(/\[(.*?) TO (.*?)\]/);

        if (dates && dates.length >= 3) {
          dateFrom.value = dates[1];
          dateTo.value = dates[2];
        }
      }
    });
}

function addField() {
    formFields.value.push({ value: '', type: 'titres.\\*' });
};

function removeField(index) {
    if (formFields.value.length > 1) {
        formFields.value.splice(index, 1);
    }
};

function search() {

    //Si on a des dates vides, on remplit les champs date avec des dates max
    let date = new Date();
    if (dateTo.value == undefined || dateTo.value == '') dateTo.value = date.getFullYear().toString() + "-12-31";
    if (dateFrom.value == undefined || dateFrom.value == '') dateFrom.value = "1960-01-01";
    formFields.value.forEach((field) => {
        if (field.type === "dateSoutenance" || field.type === "datePremiereInscriptionDoctorat") {
            field.value = '[' + dateFrom.value + ' TO ' + dateTo.value + ']';
        }
    });

    emit('search', objectToQuery())
}

function objectToQuery() {
    let result = "";

    formFields.value.forEach((field, index) => {
      try {
        field.value = field.value.replace(":", "\\:")
        if (field.value === "") {
            result += " ";
        }
        // Champs spéciaux toutes les données biblio/rôles/structures
        else if (field.type === "biblio" || field.type === "roles" || field.type === "structures") {
            if (field.type === "biblio") result += ` (titres.\\*:(${field.value}) OU sujetsLibelle:(${field.value}) OU sujetsRameauLibelle:(${field.value})) OU resumes.\\*:(${field.value}) OU discipline:(${field.value}))`;
            else if (field.type === "roles") result += ` (auteursNP:(${field.value}) OU directeursNP:(${field.value}) OU presidentJuryNP:(${field.value}) OU rapporteursNP:(${field.value}) OU membresJuryNP:(${field.value}))`;
            else if (field.type === "structures") result += ` (etabSoutenanceN:(${field.value}) OU etabsCotutelleN:(${field.value}) OU ecolesDoctoralesN:(${field.value}) OU partenairesRechercheN:(${field.value}))`;

            if (index !== formFields.value.length - 1) {
                result += ` ${operator.value}`;
            }
        }
        else {
            result += ` ${field.type}:(${field.value})`;

            //Cas particulier : pour les mots clés on ajoute également les rameaux
            if (field.type === "sujetsLibelle") result += ` OU sujetsRameauLibelle:(${field.value}))`;

            if (index !== formFields.value.length - 1) {
                result += ` ${operator.value}`;
            }
        }
      } catch(error) {
      }
    });

    return deleteEndOperator(result.replaceAll('status:(accessible)', 'accessible:oui').replaceAll('sujetsLibelle', '(sujetsLibelle').trim());
}

function deleteEndOperator(texte) {
    if (texte.endsWith(" ET") || texte.endsWith(" OU")) {
        return texte.slice(0, - 3);
    } else {
        return texte;
    }
}

function clear() {
    for (const element of formFields.value) {
        element.value = '';
    }
    dateTo.value = '';
    dateFrom.value = '';
}

function clearField(index) {
    if (formFields.value[index].type === "dateSoutenance" || formFields.value[index].type === "datePremiereInscriptionDoctorat") {
        dateTo.value = '';
        dateFrom.value = '';
    }

    formFields.value[index].value = "";
}

function queryToObject(query) {
  const operatorMatch = query.match(/\b(ET|OU)\b/g);
  const operator = operatorMatch ? operatorMatch[0] : null;
  const pattern = /([a-zA-Z0-9.\\*]+):\(([^()]+)\)/g;
  const singlePattern = /([a-zA-Z0-9.\\*]+):([^()\s]+)/g;
  let matches;
  const result = [];

  const replaceTypeIfNeeded = (type) => {
    const replacement = typeReplacements.find(r => r.match === type);
    return replacement ? replacement.replaceWith : type;
  };

  while ((matches = pattern.exec(query)) !== null) {
    let type = replaceTypeIfNeeded(matches[1].replace(/\.\\\*/g, ''));
    let values = matches[2].replace(/\+/g, ' ').split(' ');
    let value = values.join(' ');

    result.push({ type, value });
  }

  while ((matches = singlePattern.exec(query)) !== null) {
    let type = replaceTypeIfNeeded(matches[1].replace(/\.\\\*/g, ''));
    let value = matches[2].replace(/\+/g, ' ');

    result.push({ type, value });
  }

  if (!query.includes(':')) {
    result.push({ type: "titres.\\*", value: query });
  }

  return { result, operator };
}

/**
 * Watchers
 */

watch(dateFrom, () => {
  formFields.value.forEach((field) => {
    if (field.type === "dateSoutenance" || field.type === "datePremiereInscriptionDoctorat") {
      field.value = '[' + dateFrom.value + ' TO ' + dateTo.value + ']';
    }
  });
});

watch(dateTo, () => {
  formFields.value.forEach((field) => {
    if (field.type === "dateSoutenance" || field.type === "datePremiereInscriptionDoctorat") {
      field.value = '[' + dateFrom.value + ' TO ' + dateTo.value + ']';
    }
  });
});
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.form-row {
  display: grid;
  grid-template-columns: 250px auto 20px;
  gap: 10px;
  margin-bottom: 10px;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
    grid-template-columns: 4fr 1fr;
  }
}

.type {
  @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
    grid-row-start: 1;
    grid-row-end: 2;
    grid-column-start: 1;
    grid-column-end: 3;
    width: fit-content;
  }

  @media #{ map-get(settings.$display-breakpoints, 'lg-and-up')} {
    border-bottom: 1px solid rgb(var(--v-theme-secondary-darken-2));
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
  flex-wrap: wrap;
}

.calendar-row {
  display: flex;
  flex-direction: row;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
    width: 100%;
    padding-top: 5px;

    .calendar-text {
      padding-left: unset !important;
    }
  }
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

.v-list {
  padding: 0 !important;
}

:deep(.v-list-item) {
  padding-bottom: 0 !important;
  padding-top: 0 !important;
  min-height: 35px !important;
}


:deep(.v-list-item-title) {
  font-size: 0.9rem !important;
}

:deep(.v-list-subheader) {
  padding-top: 5px;
  font-size: 1rem;
  color: rgb(var(--v-theme-secondary-darken-2));
  font-weight: 500;
}

:deep(.v-switch__track) {
  background-color: rgb(var(--v-theme-gris-switch));
}

:deep(.v-input__details) {
  margin-top: -50px;
}

.v-field--container:focus-within {
  border: 1px solid rgb(var(--v-theme-secondary-darken-2));
  box-sizing: border-box;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.3);
  padding: 3px;
  transition: border-color 0.3s ease;
}
</style>

<style>
.dp__input {
  font-size: 14px;
}
</style>