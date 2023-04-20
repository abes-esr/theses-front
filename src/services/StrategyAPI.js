import { ref } from "vue";
import { router } from "@/router";
import { useDisplay } from "vuetify";
import { thesesAPIService } from "@/services/ThesesAPI";
import { personnesAPIService } from "@/services/PersonnesAPI";
import { referentielsAPIService } from "@/services/ReferentielsAPI";
import { replaceAndEscape } from "@/services/Common";

// import fonctions
const { fetchCodeLangues, createLabels, getLabelFromCode } = referentielsAPIService();
const { suggestionTheses, getFacetsTheses, getThese, queryThesesAPI, getItemsTriTheses, disableOrFiltersTheses, getItemsTriMapTheses } = thesesAPIService();
const { suggestionPersonne, getFacetsPersonnes, getPersonne, queryPersonnesAPI, getItemsTriPersonnes, disableOrFiltersPersonnes, getItemsTriMapPersonnes } = personnesAPIService();

/**
 * Initialisation
 */
const startingParameterPageFirstLoad = parseInt( getURLParameter('page') );
const startingParameterShowingNumberFirstLoad = parseInt( getURLParameter('nb') );
const startingParameterTriFirstLoad = getURLParameter('tri');

const domaine = ref("theses");
// Page de résultats courante
const currentPageNumber = ref(startingParameterPageFirstLoad ? startingParameterPageFirstLoad : 1);
// Nombre de résultats par page
const currentShowingNumber = ref(startingParameterShowingNumberFirstLoad ? startingParameterShowingNumberFirstLoad : 10);
// Valeur de tri
const currentSorting = ref(startingParameterTriFirstLoad ? startingParameterTriFirstLoad : "pertinence");

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
function setPageNumber(value) {
  currentPageNumber.value = parseInt(value);
  updateURL();
}

function getCurrentPageNumber() {
  if(currentPageNumber.value)
    return parseInt(currentPageNumber.value);
}

function setShowingNumber(value) {
  currentShowingNumber.value = parseInt(value);
  updateURL();
}

function getCurrentShowingNumber() {
  if(currentShowingNumber.value)
    return parseInt(currentShowingNumber.value);
}

function setSorting(value) {
  currentSorting.value = value;
  updateURL();
}

function setDomaine(newDomain) {
  domaine.value = newDomain;
  updateURL();
}

function getCurrentSorting() {
  if(currentSorting.value)
    return currentSorting.value;
}

function setQuery(newQuery) {
  query.value = (typeof newQuery !== 'undefined' && newQuery !== '') ? newQuery : '*';
  updateURL();
}

function setCheckedFilters(objectsArray) {
  return new Promise((resolve) => {
    currentFacets.value = parseFacetsValuesArray(objectsArray);
    updateURL();
    checkedFilters.value = objectsArray;
    resolve();
  });
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
 * Gestion URL
 */
async function getURLParameters() {
  return new Promise((resolve) => {
    const mobile = useDisplay().mobile._object.mobile;

    const startingParameterTri = getURLParameter('tri');
    const startingParameterFiltres = getURLParameterNoBrackets('filtres');
    const startingParameterQ = getURLParameter('q');
    const startingParameterDomaine = getURLParameter('domaine');
    const startingParameterPage = mobile ? 1 : parseInt( getURLParameter('page') );
    const startingParameterShowingNumber = mobile ? 10 : parseInt( getURLParameter('nb') );

    currentSorting.value = startingParameterTri ? startingParameterTri : 'pertinence';
    currentFacets.value = startingParameterFiltres ? startingParameterFiltres : '';
    query.value = (startingParameterQ && typeof startingParameterQ !== 'undefined') ? startingParameterQ : '*';
    domaine.value = startingParameterDomaine ? startingParameterDomaine : 'theses';
    currentPageNumber.value = startingParameterPage ? startingParameterPage : 1;
    currentShowingNumber.value = startingParameterShowingNumber ? startingParameterShowingNumber : 10;

    resolve();
  });
}

function getURLParameterNoBrackets(parameter) {
  return getURLParameter(parameter).replaceAll('[', '').replaceAll(']', '');
}

function getURLParameter(parameter) {
  const params = router.currentRoute._value.query;
  if (params[parameter]) {
    return decodeURIComponent(params[parameter]);
  }
  return "";
}

function setParameters() {
  let params = {};

  if (currentFacets.value) params['filtres'] = encodeURIComponent("[" + disableOrFilters().toString() + "]");
  if (query.value) params['q'] = query.value;
  if (currentPageNumber.value) params['page'] = currentPageNumber.value;
  if (currentShowingNumber.value) params['nb'] = currentShowingNumber.value;
  if (currentSorting.value) params['tri'] = currentSorting.value;
  if (domaine.value) params['domaine'] = domaine.value;

  return params;
}

function updateURL() {
  if(router.currentRoute._value.name === 'resultats') {
    const routerParams = setParameters();
    router.replace({
      name: 'resultats',
      query: routerParams
    });
  }
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
  query.value = (typeof query.value === 'undefined') ? '*' : query.value;

  if(domaine.value === "theses")
    return queryThesesAPI(replaceAndEscape(query.value), getFacetsRequest(), currentPageNumber.value, currentShowingNumber.value, currentSorting.value);
  if(domaine.value === "personnes")
    return queryPersonnesAPI(replaceAndEscape(query.value), getFacetsRequest(), currentPageNumber.value, currentShowingNumber.value, currentSorting.value);
}

/**
 * Récupère seulement les filtres présents dans l'URL ET dans le retour elastic search
 * @param facetsArray
 * @returns {*[]}
 */
function getFiltersOnlyInURLAndInESResponse(facetsArray) {
  let dataCleanedFacetsArray = [];
  // Gestion dates
  dataCleanedFacetsArray.push(...facetsArray.filter((urlFacet) => {
    return Object.keys(urlFacet)[0].startsWith('date');
  }));
  // Gestion autres facettes retournées par theses-api-recherche
  rawFacets.value.forEach((facet) => {
    dataCleanedFacetsArray.push(...facetsArray.filter((urlFacet) => {
      if (facet.name.toLowerCase() === Object.keys(urlFacet)[0].toLowerCase()) {
        return rawFacetReturnedFilter(facet, Object.values(urlFacet)[0]);
      }
      return false;
    }));
  });
  return dataCleanedFacetsArray;
}

/**
 * Parse le paramètre filtres de l'url pour le restituer dans un array
 * @returns {*[]}
 */
function getFacetsArrayFromURLString() {
  let facetsArray  = [];
  const stringifiedFacetsArray = currentFacets.value
    .slice(currentFacets.value.indexOf("[") + 1, currentFacets.value.indexOf("]"))
    .split("&");

  stringifiedFacetsArray.forEach((facet) => {
    let line = facet.split("=");
    facetsArray.splice(
      0, 0, {
        [line[0]]: line[1].replaceAll("\"", "")
      });
  });

  return facetsArray;
}

/**
 * Parse le parametre filtres de l'url pour récupérer chaque filtre
 * Et les nettoyer selon les résultats d'elastic search puis récupérer la mise en forme des labels d'elastic search
 * @returns {*|*[]}
 */
function getFacetsArrayFromURL() {
  if (!currentFacets.value) return [];

  let facetsArray = getFacetsArrayFromURLString();

  // Enlever les filtres qui ne sont pas dans la liste de facettes retournée par elastic search
  let dataCleanedFacetsArray = getFiltersOnlyInURLAndInESResponse(facetsArray);

  // Récupérer les labels avec les mises en forme récupérées depuis elastic search
  return getFacetsLabels(dataCleanedFacetsArray);
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

/**
 * Réinitialisation
 */
function reinitializeResultData() {
  query.value = '*';
  currentSorting.value = 'pertinence';
  currentPageNumber.value = 1;
  currentShowingNumber.value = 10;
  currentFacets.value = [];
  rawFacets.value = [];
}

/**
 * Récupère les filtres cochés qui ne sont pas dans la liste courante des facettes
 * En les ajoutant dans le tableau des facettes, derrière les facettes retournées par la recherche courante et par ordre alphabétique
 */
function addCheckedFilters() {
  // Tri alphabétique
  checkedFilters.value.sort((a, b) => {
    return Object.values(a)[0] > Object.values(b)[0];
  });

  checkedFilters.value.forEach((checkedFilter) => {
    const checkedFilterFacetName = Object.keys(checkedFilter)[0];
    const checkedFilterName = Object.values(checkedFilter)[0];

    getCheckedFiltersBackIntoList(checkedFilterName, checkedFilterFacetName);
  });
}

function rawFacetReturnedFilter(facet, checkedFilterName) {
  let flattenedFacet = getFlattenedCheckboxesArray(facet);

  return flattenedFacet.filter((filter) => {
    return filter.name.toLowerCase() === checkedFilterName.toLowerCase();
  }).length > 0;
}

function facetIsEmpty(facet) {
  return Object.keys(facet.checkboxes).length < 1;
}

/**
 * Si les filtres cochés présents dans rawFacets ne sont pas dans la liste des facettes
 * retournées par l'API alors on les ajoute à cette même liste avec la valeur 0
 * Seulement si la facette est peuplée
 * @param checkedFilterName
 * @param checkedFilterFacetName
 */
function getCheckedFiltersBackIntoList(checkedFilterName, checkedFilterFacetName) {
  rawFacets.value.forEach((facet) => {
    if ( !facetIsEmpty(facet)
      && (facet.name.toLowerCase() === checkedFilterFacetName.toLowerCase()) ) {
      let currentFacet = { ...facet }; // cloner l'objet
      currentFacet.checkboxes = getFlattenedCheckboxesArray(facet);

      if (!rawFacetReturnedFilter(currentFacet, checkedFilterName)) {
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

function getTriMap() {
  if(domaine.value === "theses")
    return getItemsTriMapTheses();
  if(domaine.value === "personnes")
    return getItemsTriMapPersonnes();
}

function addToFiltersLabelsMap(filterData) {
  labelMap.value.set(filterData.filterName, filterData.label);
}

/**
 *
 * @returns {{setCheckedFilters: setCheckedFilters, queryAPI: ((function(): (*|undefined))|*), getFacets: ((function(): (*|undefined))|*), setShowingNumber: setShowingNumber, setPageNumber: setPageNumber, setQuery: setQuery, getData: ((function(*): (*|undefined))|*), getSuggestion: ((function(): (*|undefined))|*), setSorting: setSorting}}
 * @constructor
 */
export function APIService() {
  return {
    setPageNumber,
    setShowingNumber,
    setSorting,
    getCurrentPageNumber,
    getCurrentShowingNumber,
    getCurrentSorting,
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
    addToFiltersLabelsMap,
    getTriMap,
    reinitializeResultData
  };
}