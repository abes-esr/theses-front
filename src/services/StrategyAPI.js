import { ref } from "vue";
import { thesesAPIService } from "@/services/ThesesAPI";
import { personnesAPIService } from "@/services/PersonnesAPI";
import { useRoute } from "vue-router";

// import fonctions
const { suggestionTheses, getFacetsTheses, getThese, queryThesesAPI } = thesesAPIService();
const { suggestionPersonne, getFacetsPersonnes, getPersonne, queryPersonnesAPI } = personnesAPIService();
const currentRoute = useRoute();
// Page de résultats courante
const currentPage = ref(1);
// Nombre de résultats par page
const currentNombre = ref(10);
// Valeur de tri
const currentTri = ref("pertinence");
const currentFacets = ref([]);
const query = ref("");

/**
 * Fonctions communes
 */
function modifierPage(value) {
  currentPage.value = value;
}

function modifierNombre(value) {
  currentNombre.value = value;
}

function modifierTri(value) {
  currentTri.value = value;
}

function modifierFiltres(objectsArray) {
  currentFacets.value = parseFacetsValuesArray(objectsArray);
}

function setQuery(newQuery) {
  query.value = newQuery ? newQuery : "*";
}

/**
 * Mise en forme du tableau de valeurs des facettes à destination de l'url
 * @param objectsArray
 * @returns {string}
 */
function parseFacetsValuesArray(objectsArray) {
  let filtersArrayURL = [];

  objectsArray.forEach((filter) => {
    filtersArrayURL.push(Object.keys(filter)[0] + '="' + Object.values(filter)[0] + '"');
  });

  return filtersArrayURL.join('&').toLowerCase();
}

function getCurrentDomain() {
  return currentRoute.query.domaine;
}

/**
 * Routes
 */
function queryAPI() {
  if(getCurrentDomain() === "theses")
    return queryThesesAPI(query.value, currentFacets, currentPage, currentNombre, currentTri);
  if(getCurrentDomain() === "personnes")
    return queryPersonnesAPI(query.value, currentFacets, currentPage, currentNombre, currentTri);
}

function getFacets() {
  if(getCurrentDomain() === "theses")
    return getFacetsTheses(query.value);
  if(getCurrentDomain() === "personnes")
    return getFacetsPersonnes(query.value);
}

function getData(id) {
  if(getCurrentDomain() === "theses")
    return getThese(id);
  if(getCurrentDomain() === "personnes")
    return getPersonne(id);
}

function getSuggestion() {
  if(getCurrentDomain() === "theses")
    return suggestionTheses(query.value);
  if(getCurrentDomain() === "personnes")
    return suggestionPersonne(query.value);
}

export function APIService() {
  return {
    modifierPage,
    modifierNombre,
    modifierTri,
    modifierFiltres,
    setQuery,
    queryAPI,
    getFacets,
    getData,
    getSuggestion
  };
}