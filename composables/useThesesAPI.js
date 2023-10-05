import { replaceAndEscape } from "../services/Common";
import { useAPIFetch } from "./useAPIFetch";

/// #TODO Passer les routes en variables/paramètres?
/**
 * Les statuts "soutenue" et "en cours" s'annulent
 * @param facets
 * @returns {*}
 */
function disableOrFiltersTheses(facets) {
  if (facets.includes("soutenues") && facets.includes("enCours"))
    return facets.filter(e => e !== "soutenues").filter(e => e !== "enCours").filter(e => e !== "accessible");
  return facets;
}

// Recherche simple dans les theses
function queryThesesAPI(query, facetsRequest, currentPageNumber, currentShowingNumber, currentSorting) {
  const url = "/theses/recherche/?q=" + encodeURIComponent(query) + "&debut=" + ((currentPageNumber - 1) * currentShowingNumber) + "&nombre=" + currentShowingNumber + "&tri=" + currentSorting + facetsRequest;

  return new Promise((resolve, reject) => {
    useAPIFetch(url)
      .then((response) => {
      resolve(response.data.value);
    }).catch((err) => {
      reject(err);
    });
  });
}

//Autcomplétion recherche simple
// #TODO gérer les erreurs
function suggestionTheses(query) {
  return useAPIFetch("/theses/completion/?q=" + encodeURIComponent(replaceAndEscape(query)));
}

/**
 * Récupération des facettes pour une requête donnée
 * @param query
 * @returns {Promise<AxiosResponse<any>>}
 */
// #TODO gérer les erreurs
function getFacetsTheses(query, facetsRequest) {
  return useAPIFetch("/theses/facets/?q=" + encodeURIComponent(replaceAndEscape(query)) + facetsRequest);
}

/**
 * Récupération des infos détaillées d'une theses
 * @param nnt
 * @returns {Promise<AxiosResponse<any>>}
 */
// #TODO gérer les erreurs
function getThese(nnt) {
  return useAPIFetch( "theses/these/" + nnt);
}

function getButtons(nnt) {
  return useAPIFetch("/button/" + nnt);
}

function getItemsTriTheses() {
  return [
    { nom: "Pertinence", cle: "pertinence" },
    { nom: "Date croissante", cle: "dateAsc" },
    { nom: "Date décroissante", cle: "dateDesc" },
    { nom: "Auteurs A-Z", cle: "auteursAsc" },
    { nom: "Auteurs Z-A", cle: "auteursDesc" },
    { nom: "Discipline A-Z", cle: "disciplineAsc" },
    { nom: "Discipline Z-A", cle: "disciplineDesc" }
  ];
}

function getItemsTriMapTheses() {
  let itemsNamesMap = new Map();

  itemsNamesMap.set("pertinence", "Pertinence");
  itemsNamesMap.set("dateAsc", "Date croissante");
  itemsNamesMap.set("dateDesc", "Date décroissante");
  itemsNamesMap.set("auteursAsc", "Auteurs A-Z");
  itemsNamesMap.set("auteursDesc", "Auteurs Z-A");
  itemsNamesMap.set("disciplineAsc", "Discipline A-Z");
  itemsNamesMap.set("disciplineDesc", "Discipline Z-A");

  return itemsNamesMap;
}

function getStatsTheses() {
  return useAPIFetch("theses/statsTheses");
}

function getStatsSujets() {
  return useAPIFetch("theses/statsSujets");
}

function postSignalerErreur(jsonData) {
  return useAPIFetch("/theses/these/signaler/", {
        method: 'post',
        body: jsonData
    })
}

/**
 * Service lié aux thèses
 * @returns {{rechercherPersonne: ((function(*): Promise<AxiosResponse<*>>)|*), listePersonnes: Ref<UnwrapRef<{}>>, selectedDomain: Ref<UnwrapRef<string>>, modifierDomaine: modifierDomaine}}
 */
export default function () {
  return {
    queryThesesAPI,
    suggestionTheses,
    getFacetsTheses,
    getThese,
    getStatsSujets,
    getStatsTheses,
    getItemsTriTheses,
    disableOrFiltersTheses,
    getItemsTriMapTheses,
    getButtons,
    postSignalerErreur
  };
}