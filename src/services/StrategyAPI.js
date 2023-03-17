import { ref } from "vue";
import { thesesAPIService } from "@/services/ThesesAPI";
import { personnesAPIService } from "@/services/PersonnesAPI";
import { referentielsAPIService } from "@/services/ReferentielsAPI";

// import fonctions
const { fetchCodeLangues, createLabels } = referentielsAPIService();
const { suggestionTheses, getFacetsTheses, getThese, queryThesesAPI } = thesesAPIService();
const { suggestionPersonne, getFacetsPersonnes, getPersonne, queryPersonnesAPI } = personnesAPIService();

const domaine = ref("theses");
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

function setDomaine(newDomain) {
  domaine.value = newDomain;
}

/**
 * Routes
 */
function queryAPI() {
  if(domaine.value === "theses")
    return queryThesesAPI(query.value, currentFacets.value, currentPage.value, currentNombre.value, currentTri.value);
  if(domaine.value === "personnes")
    return queryPersonnesAPI(query.value, currentFacets.value, currentPage.value, currentNombre.value, currentTri.value);
}

async function getFacets() {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    var rawFacets = {};

    await fetchCodeLangues();

    if (domaine.value === "theses") {
      await getFacetsTheses(query.value)
        .then(response => {
          rawFacets = response.data;
        }).catch((err) => {
        reject(err);
      });
    }

    if (domaine.value === "personnes") {
      await getFacetsPersonnes(query.value)
        .then(response => {
          rawFacets = response.data;
        }).catch((err) => {
          reject(err);
        });
    }

    if (Object.keys(rawFacets).length > 0) {
      createLabels(rawFacets)
      resolve(rawFacets);
    }
    reject();
  });
}

function getData(id) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise( async (resolve, reject) => {
    let thesisData = {};

    if (domaine.value === "theses") {
      await getThese(id)
        .then(response => {
          thesisData = response;
        }).catch((err) => {
          reject(err);
        });
    }

    if (domaine.value === "personnes") {
      await getPersonne(id)
        .then(response => {
          thesisData = response;
        }).catch((err) => {
          reject(err);
        });
    }

    if (Object.keys(thesisData).length > 0) {
      resolve(thesisData);
    }
    reject();
  });
}

function getSuggestion() {
  console.info(domaine.value)
  if(domaine.value === "theses")
    return suggestionTheses(query.value);
  if(domaine.value === "personnes")
    return suggestionPersonne(query.value);
}

/**
 *
 * @returns {{modifierFiltres: modifierFiltres, queryAPI: ((function(): (*|undefined))|*), getFacets: ((function(): (*|undefined))|*), modifierNombre: modifierNombre, modifierPage: modifierPage, setQuery: setQuery, getData: ((function(*): (*|undefined))|*), getSuggestion: ((function(): (*|undefined))|*), modifierTri: modifierTri}}
 * @constructor
 */
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
    getSuggestion,
    setDomaine
  };
}