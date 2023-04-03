import { ref } from "vue";
import { thesesAPIService } from "@/services/ThesesAPI";
import { personnesAPIService } from "@/services/PersonnesAPI";
import { referentielsAPIService } from "@/services/ReferentielsAPI";
import { replaceAndEscape } from "@/services/Common";

// import fonctions
const { fetchCodeLangues, createLabels } = referentielsAPIService();
const { suggestionTheses, getFacetsTheses, getThese, queryThesesAPI, getItemsTriTheses, disableOrFiltersTheses } = thesesAPIService();
const { suggestionPersonne, getFacetsPersonnes, getPersonne, queryPersonnesAPI, getItemsTriPersonnes, disableOrFiltersPersonnes } = personnesAPIService();

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
  setURLFilters();
}

function setQuery(newQuery) {
  query.value = newQuery ? newQuery : "*";
  setURLQuery()
}

function getQuery() {
  return query.value;
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
  setURLDomaine();
}

/**
 * Pour thèses : les status "soutenue" et "en cours" s'annulent
 * @returns {*}
 */
function disableOrFilters() {
  if (domaine.value === "theses") {
    return disableOrFiltersTheses(currentFacets.value);
  }

  return currentFacets.value;
}

/**
 * Routes
 */
function queryAPI() {
  const facetsRequest = currentFacets.value.length > 0
    ? "&filtres=" + encodeURIComponent("[" + disableOrFilters().toString() + "]")
    : "";

  if(domaine.value === "theses")
    return queryThesesAPI(replaceAndEscape(query.value), facetsRequest, currentPage.value, currentNombre.value, currentTri.value);
  if(domaine.value === "personnes")
    return queryPersonnesAPI(replaceAndEscape(query.value), facetsRequest, currentPage.value, currentNombre.value, currentTri.value);
}

function setURLParameters() {
  setURLFilters();
  setURLQuery();
  setURLDomaine();
}

function getURLParams() {
  const url = document.location;
  return new URL(url).searchParams;
}

function setURLFilters() {
  let currentURLParams = getURLParams();

  if (currentFacets.value && currentFacets.value.length > 0) {
    currentURLParams.set("filtres", encodeURIComponent("[" + disableOrFilters().toString() + "]"));
  } else {
    currentURLParams.delete("filtres");
  }

  updateURL(document.location, currentURLParams);
}

function setURLQuery() {
  let currentURLParams = getURLParams();

  if (query.value) {
    currentURLParams.set("q", encodeURIComponent(query.value));
  } else {
    currentURLParams.delete("q");
  }

  updateURL(document.location, currentURLParams);
}

function getFacetsArrayFromURL() {
  if (!currentFacets.value) return [];

  var facetsArray = []
  const stringifiedFacetsArray  = currentFacets.value.slice(currentFacets.value.indexOf('[')+1, currentFacets.value.indexOf(']'))
    .split('&');

  stringifiedFacetsArray.forEach((facet) => {
    let line = facet.split('=');
    facetsArray.splice(
      0, 0, {
      [line[0]]: line[1].replaceAll('"', '')
    });
  });

  return facetsArray;
}

function setURLDomaine() {
  let currentURLParams = getURLParams();

  if (domaine.value) {
    currentURLParams.set("domaine", encodeURIComponent(domaine.value));
  } else {
    currentURLParams.set("domaine", 'theses');
  }

  updateURL(document.location, currentURLParams);
}

function getURLParameters() {
  const url = document.location;
  let currentURLParams = new URL(url).searchParams;

  currentFacets.value = getURLParameterNoBrackets(currentURLParams, 'filtres');
  query.value = getURLParameter(currentURLParams, 'q');
  domaine.value = getURLParameter(currentURLParams, 'domaine');
}

function getURLParameterNoBrackets(currentURLParams, parameter) {
  return getURLParameter(currentURLParams, parameter).replaceAll('[', '').replaceAll(']', '');
}

function getURLParameter(currentURLParams, parameter) {
  if (currentURLParams.get(parameter)) {
    return decodeURIComponent(currentURLParams.get(parameter));
  }

  return "";
}

function updateURL(url, currentURLParams) {
  const newUrl = `${url.pathname}?${currentURLParams}`;
  window.history.pushState({}, "", newUrl);
}

async function getFacets() {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    let rawFacets = {};

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
  if(domaine.value === "theses")
    return suggestionTheses(query.value);
  if(domaine.value === "personnes")
    return suggestionPersonne(query.value);
}

function getItemsTri() {
  if(domaine.value === "theses")
    return getItemsTriTheses();
  if(domaine.value === "personnes")
    return getItemsTriPersonnes();
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
    getQuery,
    queryAPI,
    getFacets,
    getData,
    getSuggestion,
    setDomaine,
    getItemsTri,
    getURLParameters,
    getFacetsArrayFromURL
  };
}