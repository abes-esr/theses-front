import { ref } from "vue";
import { thesesAPIService } from "@/services/ThesesAPI";
import { personnesAPIService } from "@/services/PersonnesAPI";
import { referentielsAPIService } from "@/services/ReferentielsAPI";
import { replaceAndEscape } from "@/services/Common";

// import fonctions
const { fetchCodeLangues, createLabels, getLabelFromCode } = referentielsAPIService();
const { suggestionTheses, getFacetsTheses, getThese, queryThesesAPI, getItemsTriTheses, disableOrFiltersTheses } = thesesAPIService();
const { suggestionPersonne, getFacetsPersonnes, getPersonne, queryPersonnesAPI, getItemsTriPersonnes, disableOrFiltersPersonnes } = personnesAPIService();

/**
 * Initialisation
 */
const domaine = ref("theses");
// Page de résultats courante
const currentPage = ref(1);
// Nombre de résultats par page
const currentNombre = ref(10);
// Valeur de tri
const currentTri = ref("pertinence");
const currentFacets = ref([]);
const query = ref("");
const rawFacets = ref([]);
const checkedFilters = ref([]);
const currentWorkingFacetName = ref("");
const labelMap = ref(new Map());


fetchCodeLangues();

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

function setCheckedFilters(objectsArray) {
  return new Promise((resolve) => {
    currentFacets.value = parseFacetsValuesArray(objectsArray);
    setURLFilters();
    checkedFilters.value = objectsArray;
    resolve();
  });
}

function setQuery(newQuery) {
  query.value = newQuery ? newQuery : "*";
  setURLQuery()
}

function setWorkingFacetName(facetName) {
  currentWorkingFacetName.value = facetName;
}

function getQuery() {
  return query.value;
}

function getFacetsRequest() {
  return currentFacets.value.length > 0
  ? "&filtres=" + encodeURIComponent("[" + disableOrFilters().toString() + "]")
  : "";
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
  if(domaine.value === "theses")
    return queryThesesAPI(replaceAndEscape(query.value), getFacetsRequest(), currentPage.value, currentNombre.value, currentTri.value);
  if(domaine.value === "personnes")
    return queryPersonnesAPI(replaceAndEscape(query.value), getFacetsRequest(), currentPage.value, currentNombre.value, currentTri.value);
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
  const stringifiedFacetsArray  = currentFacets.value
    .slice(currentFacets.value.indexOf('[')+1, currentFacets.value.indexOf(']'))
    .split('&');

  stringifiedFacetsArray.forEach((facet) => {
    let line = facet.split('=');
    facetsArray.splice(
      0, 0, {
      [line[0]]: line[1].replaceAll('"', '')
    });
  });

  return getFacetsLabels(facetsArray);
}

/**
 * Aplatit tous les niveaux de récursion des checkboxes pour une facette donnée
 * @param facetArray
 * @returns {*[]}
 */
function getFlattenedCheckboxesArray(facetArray) {
  let deepArray = [];

  if (facetArray.checkboxes) {
    deepArray.push(...facetArray.checkboxes);

    facetArray.checkboxes.forEach((facet) => {
      deepArray.push(...getFlattenedCheckboxesArray(facet));
    });
  }
  return deepArray;
}

/**
 * Récupère le label d'un filtre récupéré depuis l'url ; permet d'avoir le texte mis en forme
 * depth gère la récursion
 * @param urlFacet
 * @returns {*|string|string}
 */
function getLabelFromURLName(urlFacet) {
  let correspondingFacet = {};
  let currentFacets = [];

  rawFacets.value.forEach((facet) => {
    if (facet.name.toLowerCase() === urlFacet.facetName.toLowerCase()) {
      currentFacets = getFlattenedCheckboxesArray(facet);
      correspondingFacet = currentFacets.find((filter) => {
        return filter.name.toLowerCase() === urlFacet.filterName.toLowerCase();
      });
    }
  });

  return correspondingFacet ? correspondingFacet.label : "";
}

/**
 * Récupère les labels des filtres avec mise en forme ; les noms des langues pour les codes langues ; le int de l'année pour les dates
 * @param facetsArray
 */
function getFacetsLabels(facetsArray) {
  facetsArray.forEach((facet) => {
    facet.filterName = Object.values(facet)[0];
    facet.facetName = Object.keys(facet)[0];

    if (Object.keys(facet)[0].toLowerCase() === 'langues') {
      facet.label = getLabelFromCode(facet.filterName);
    } else if (Object.keys(facet)[0].toLowerCase().startsWith('date')) {
      facet.label = parseInt(facet.filterName);
      facet.filterName = facet.facetName;
    } else {
      let label = getLabelFromURLName(facet);
      facet.label = label ? label : facet.filterName;
    }
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

async function getURLParameters() {
  return new Promise((resolve) => {
    const url = document.location;
    let currentURLParams = new URL(url).searchParams;

    currentFacets.value = getURLParameterNoBrackets(currentURLParams, 'filtres');
    query.value = getURLParameter(currentURLParams, 'q');
    domaine.value = getURLParameter(currentURLParams, 'domaine');

    resolve();
  });
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

function replaceWorkingFacet(facetsArray, currentWorkingFacet) {
  if (currentWorkingFacet.length > 0) {
    const facetIndex = facetsArray.findIndex((facet) => {
      return facet.name.toLowerCase() === currentWorkingFacetName.value.toLowerCase();
    });

    if (facetIndex > -1)
      facetsArray.splice(facetIndex, 1, currentWorkingFacet[0]);
  }

  return facetsArray;
}

function addCheckedFilters() {
  checkedFilters.value.forEach((checkedFilter) => {
    const checkedFilterFacetName = Object.keys(checkedFilter)[0];
    const checkedFilterName = Object.values(checkedFilter)[0];

    getBackCheckedFiltersIntoList(checkedFilterName, checkedFilterFacetName);
  });
}

function rawFacetReturnedFilter(facet, checkedFilterName) {
  return facet.checkboxes.filter((filter) => {
    return filter.name.toLowerCase() === checkedFilterName.toLowerCase();
  }).length > 0;
}

function getBackCheckedFiltersIntoList(checkedFilterName, checkedFilterFacetName) {
  rawFacets.value.forEach((facet) => {
    if (facet.name.toLowerCase() === checkedFilterFacetName.toLowerCase()) {
      if (!rawFacetReturnedFilter(facet, checkedFilterName)) {
        const label = labelMap.value.get(checkedFilterName);

        facet.checkboxes.push(
          {
            'name': checkedFilterName,
            'label': label ? label : checkedFilterName,
            'value': 0
          }
        );
      }
    }
  });
}

async function getFacets() {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const currentWorkingFacet = rawFacets.value.filter((facet) => {
      return facet.name.toLowerCase() === currentWorkingFacetName.value.toLowerCase();
    });

    if (domaine.value === "theses") {
      await getFacetsTheses(query.value, getFacetsRequest())
        .then(response => {
          rawFacets.value = replaceWorkingFacet(response.data, currentWorkingFacet);
        }).catch((err) => {
        reject(err);
      });
    }

    if (domaine.value === "personnes") {
      await getFacetsPersonnes(query.value)
        .then(response => {
          rawFacets.value = response.data;
        }).catch((err) => {
          reject(err);
        });
    }

    if (Object.keys(rawFacets.value).length > 0) {
      addCheckedFilters();
      createLabels(rawFacets.value);
      resolve(rawFacets.value);
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
  return new Promise ((resolve) => {
    if(domaine.value === "theses")
      resolve(suggestionTheses(query.value));
    if(domaine.value === "personnes")
      resolve(suggestionPersonne(query.value));
  });
}

function getItemsTri() {
  if(domaine.value === "theses")
    return getItemsTriTheses();
  if(domaine.value === "personnes")
    return getItemsTriPersonnes();
}

function addToMap(filterData) {
  labelMap.value.set(filterData.filterName, filterData.label);
  console.info(labelMap.value);
}

/**
 *
 * @returns {{setCheckedFilters: setCheckedFilters, queryAPI: ((function(): (*|undefined))|*), getFacets: ((function(): (*|undefined))|*), modifierNombre: modifierNombre, modifierPage: modifierPage, setQuery: setQuery, getData: ((function(*): (*|undefined))|*), getSuggestion: ((function(): (*|undefined))|*), modifierTri: modifierTri}}
 * @constructor
 */
export function APIService() {
  return {
    modifierPage,
    modifierNombre,
    modifierTri,
    setCheckedFilters,
    setQuery,
    getQuery,
    queryAPI,
    getFacets,
    getData,
    getSuggestion,
    setDomaine,
    getItemsTri,
    getURLParameters,
    getFacetsArrayFromURL,
    setWorkingFacetName,
    addToMap
  };
}