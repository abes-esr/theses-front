import { ref } from "vue";
import { useDisplay } from "vuetify";
import { replaceAndEscape } from "../services/Common";

/**
 * Initialisation
 */
const domaine = ref("theses");
const currentPageNumber = ref();
const currentShowingNumber = ref();
const currentSorting = ref();
const currentFacets = ref([]);
const query = ref("");
const rawFacets = ref([]);
const checkedFilters = ref([]);
const currentWorkingFacetName = ref("");
const labelMap = ref(new Map());
const facetsArray = ref([]);

export default function() {
// import fonctions
  const { fetchCodeLangues, createLabels, getLabelFromCode } = useReferentielsAPI();
  const {
    suggestionTheses,
    getFacetsTheses,
    queryThesesAPI,
    getItemsTriTheses,
    disableOrFiltersTheses,
    getItemsTriMapTheses
  } = useThesesAPI();
  const {
    suggestionPersonne,
    getFacetsPersonnes,
    queryPersonnesAPI,
    getItemsTriPersonnes,
    getItemsTriMapPersonnes
  } = usePersonnesAPI();

  const router = useRouter();

  /**
   * Fonctions communes
   */
  function setPageNumber(value) {
    currentPageNumber.value = parseInt(value);
    updateURL();
  }

  function setShowingNumber(value) {
    currentShowingNumber.value = parseInt(value);
    updateURL();
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
    if (typeof currentSorting.value !== "undefined") {
      return currentSorting.value;
    } else {
      const startingParameterTriFirstLoad = getURLParameter("tri");
      return startingParameterTriFirstLoad ? startingParameterTriFirstLoad : "pertinence";
    }
  }

  function setQuery(newQuery) {
    query.value = (typeof newQuery !== "undefined" && newQuery !== "" && newQuery !== null) ? newQuery : "*";
  }

  function setCheckedFilters(objectsArray) {
    currentPageNumber.value = 1;

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
      ? "&filtres=" + encodeURIComponent("[") + disableOrFilters().toString() + encodeURIComponent("]")
      : "";
  }

  /**
   * Gestion URL
   */
  async function getURLParameters() {
    return new Promise((resolve) => {
      const { mobile } = useDisplay();

      const startingParameterTri = getURLParameter("tri");
      const startingParameterFiltres = getURLParameterNoBrackets("filtres");
      const startingParameterQ = getURLParameter("q");
      const startingParameterDomaine = getURLParameter("domaine");
      const startingParameterPage = mobile.value ? 1 : parseInt(getURLParameter("page"));
      const startingParameterShowingNumber = mobile.value ? 10 : parseInt(getURLParameter("nb"));

      currentSorting.value = startingParameterTri ? startingParameterTri : "pertinence";
      currentFacets.value = startingParameterFiltres ? startingParameterFiltres : "";
      query.value = (startingParameterQ && typeof startingParameterQ !== "undefined") ? startingParameterQ : "*";
      domaine.value = startingParameterDomaine ? startingParameterDomaine : "theses";
      currentPageNumber.value = startingParameterPage ? startingParameterPage : 1;
      currentShowingNumber.value = startingParameterShowingNumber ? startingParameterShowingNumber : 10;

      resolve();
    });
  }

  function getURLParameterNoBrackets(parameter) {
    return getURLParameter(parameter).replaceAll("[", "").replaceAll("]", "");
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
    if (currentFacets.value && currentFacets.value.length > 0) params["filtres"] = encodeURIComponent("[" + disableOrFilters().toString() + "]");
    if (query.value) params["q"] = query.value;
    if (currentPageNumber.value) params["page"] = currentPageNumber.value;
    if (currentShowingNumber.value) params["nb"] = currentShowingNumber.value;
    if (currentSorting.value) params["tri"] = currentSorting.value;
    if (domaine.value) params["domaine"] = domaine.value;
    return params;
  }

  function updateURL() {
    if (router.currentRoute._value.name === "resultats") {
      const routerParams = setParameters();
      router.replace({
        name: "resultats",
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
      filtersArrayURL.push(
        Object.keys(filter)[0] + "=\"" + Object.values(filter)[0] + "\""
      );
    });

    return encodeURIComponent(
      filtersArrayURL.join("~")
    );
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
    const isAdvanced = useState("isAdvanced");

    query.value = (typeof query.value === "undefined") ? "*" : query.value;

    if (domaine.value === "personnes")
      return queryPersonnesAPI(replaceAndEscape(query.value), getFacetsRequest(), currentPageNumber.value, currentShowingNumber.value, currentSorting.value);
    else
    //La recherche avancée ne doit pas échapper les caractères spécieaux, on passe isAdvanced pour déterminer quels caractères échapper
      return queryThesesAPI(replaceAndEscape(query.value, isAdvanced.value), getFacetsRequest(), currentPageNumber.value, currentShowingNumber.value, currentSorting.value);
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
      return Object.keys(urlFacet)[0].startsWith("date");
    }));
    // Gestion autres facettes retournées par theses-api-recherche
    rawFacets.value.forEach((facet) => {
      dataCleanedFacetsArray.push(...facetsArray.filter((urlFacet) => {
        if (facet.name === Object.keys(urlFacet)[0]) {
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
    let facetsArray = [];
    const stringifiedFacetsArray = decodeURIComponent(currentFacets.value.toString()).split("~");

    if (stringifiedFacetsArray.length > 0 && stringifiedFacetsArray[0] !== "") {
      stringifiedFacetsArray.forEach((facet) => {
        let line = facet.split("=");
        facetsArray.splice(
          0, 0, {
            [line[0]]: line[1].replaceAll("\"", "")
          });
      });
    }

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
      if (facet.name === urlFacet.facetName) {
        currentFacets = getFlattenedCheckboxesArray(facet);
        correspondingFacet = currentFacets.find((filter) => {
          return filter.name === urlFacet.filterName;
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

      if (Object.keys(facet)[0] === "langues") {
        facet.label = getLabelFromCode(facet.filterName);
      } else if (Object.keys(facet)[0].startsWith("date")) {
        facet.label = parseInt(facet.filterName);
        facet.filterName = facet.facetName;
      } else {
        let label = getLabelFromURLName(facet);

        // Cas particulier
        label = handleSpecialCase(label);

        facet.label = label ? label : facet.filterName;
      }
    });

    return facetsArray;
  }


  function handleSpecialCase(label) {
    if (label === "enCours") return "En préparation";
    if (label === "soutenue") return "Soutenues";
    return label;
  }

  function replaceWorkingFacet(facetsArray, currentWorkingFacet) {
    if (currentWorkingFacet.length > 0) {
      const facetIndex = facetsArray.findIndex((facet) => {
        return facet.name === currentWorkingFacetName.value;
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
    query.value = "*";
    currentSorting.value = "pertinence";
    currentPageNumber.value = 1;
    currentShowingNumber.value = 10;
    currentFacets.value = [];
    rawFacets.value = [];
  }

  function reinitializeFilters() {
    setCheckedFilters([]);
    setWorkingFacetName("");
  }

  function reinitializeFacetFilters(facetName) {
    let facetsArray = getFacetsArrayFromURL();

    let reinitializedFacetsArray = facetsArray.filter(filter => {
      return filter.facetName !== facetName;
    });

    setCheckedFilters(reinitializedFacetsArray);
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
      return filter.name === checkedFilterName;
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
      if (!facetIsEmpty(facet)
        && (facet.name === checkedFilterFacetName)) {
        let currentFacet = { ...facet }; // cloner l'objet
        currentFacet.checkboxes = getFlattenedCheckboxesArray(facet);

        if (!rawFacetReturnedFilter(currentFacet, checkedFilterName)) {
          const label = labelMap.value.get(checkedFilterName);

          facet.checkboxes.push(
            {
              "name": checkedFilterName,
              "label": label ? label : checkedFilterName,
              "value": 0
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
        return facet.name === currentWorkingFacetName.value;
      });

      if (domaine.value === "theses") {
        await getFacetsTheses(query.value, getFacetsRequest())
          .then(response => {
            rawFacets.value = replaceWorkingFacet(response.data.value, currentWorkingFacet);
          }).catch((err) => {
            reject(err);
          });
      }

      if (domaine.value === "personnes") {
        await getFacetsPersonnes(query.value, getFacetsRequest())
          .then(response => {
            rawFacets.value = replaceWorkingFacet(response.data.value, currentWorkingFacet);
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

  /**
   * Met à jour l'url avec les filtres sélectionnés
   * Met à plat les niveaux de récursivité en utilisant le nom de la facette en clé dans tous les cas
   * @param filterData objet contenant le nom de la facette et de son filtre correspondant
   */
  function updateFilterData(filterData) {
    let facetsArray = getFacetsArrayFromURL();

    const lastFacetFilter =
      {
        [filterData.facetName]: filterData.filterName
      };

    if (isNotChecked(filterData, lastFacetFilter)) {
      // Ajout
      setWorkingFacetName(Object.keys(lastFacetFilter)[0]);
      facetsArray.splice(0, 0, lastFacetFilter);
    } else {
      // Suppression
      let itemIndex = getFacetItemIndex(lastFacetFilter, facetsArray);
      if (itemIndex > -1) {
        facetsArray.splice(itemIndex, 1);
      }
    }

    setCheckedFilters(facetsArray);
  }

  function addOrOverwriteDate(datesArray) {
    let facetsArray = getFacetsArrayFromURL();

    let dateFiltersNames = [
      "datedebut",
      "datefin"
    ];

    datesArray.forEach((dateData, key) => {
      const filterDate = { [dateFiltersNames[key]]: dateData };
      let itemIndex = -1;
      itemIndex = getFacetItemIndex(filterDate, facetsArray);

      if (itemIndex > -1) {
        facetsArray.splice(itemIndex, 1);
      }

      if (Object.values(filterDate)[0]) {
        setWorkingFacetName(Object.keys(filterDate)[0]);
        facetsArray.splice(0, 0, filterDate);
      }
    });

    setCheckedFilters(facetsArray);
  }

// Retourne l'index de l'objet courant dans le tableau facetsArray
  function getFacetItemIndex(lastFacetFilter, facetsArray) {
    return facetsArray.findIndex(function(facetFilter) {
      return filtersAreEqual(facetFilter, lastFacetFilter);
    });
  }

  function arrayContainsFilter(lastFacetFilter) {
    const countOccurrences = facetsArray.value.filter(function(facetFilter) {
      return filtersAreEqual(facetFilter, lastFacetFilter);
    }).length;
    return countOccurrences > 0;
  }

  function isDateFilter(facetFilter) {
    return Object.keys(facetFilter)[0].startsWith("date");
  }

  /**
   * checkbox cochée
   * @Param filterData
   * @Param lastFacetFilter mise en forme de filterData
   */
  function isNotChecked(filterData, lastFacetFilter) {
    return filterData.value && !arrayContainsFilter(lastFacetFilter);
  }

  /**
   * Compare les chaines de caractères contenues dans les Array
   * Pour les dates on ne compare que le nom du filtre ( datedebut | datefin )
   * @param comparedObject
   * @param currentObject
   * @returns {boolean}
   */
  function filtersAreEqual(comparedObject, currentObject) {
    return (isDateFilter(currentObject)
        && Object.keys(comparedObject)[0] === Object.keys(currentObject)[0])
      || (Object.keys(comparedObject)[0] === Object.keys(currentObject)[0]
        && Object.values(comparedObject)[0] === Object.values(currentObject)[0]);
  }

  function getSuggestion(candidate) {
    return new Promise((resolve) => {
      if (domaine.value === "theses")
        resolve(suggestionTheses(query.value));
      if (domaine.value === "personnes")
        resolve(suggestionPersonne(candidate));
    });
  }

  function getItemsTri() {
    if (domaine.value === "theses")
      return getItemsTriTheses();
    if (domaine.value === "personnes")
      return getItemsTriPersonnes();
  }

  function getTriMap() {
    if (domaine.value === "theses")
      return getItemsTriMapTheses();
    if (domaine.value === "personnes")
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
  return {
    setPageNumber,
    setShowingNumber,
    setSorting,
    getCurrentSorting,
    setQuery,
    getQuery,
    queryAPI,
    getFacetsRequest,
    getFacets,
    getSuggestion,
    setDomaine,
    getItemsTri,
    getURLParameters,
    getFacetsArrayFromURL,
    setWorkingFacetName,
    addToFiltersLabelsMap,
    getTriMap,
    reinitializeResultData,
    fetchCodeLangues,
    updateFilterData,
    addOrOverwriteDate,
    reinitializeFilters,
    reinitializeFacetFilters,
    setCheckedFilters
  };
}