import axios from "axios";
import { replaceAndEscape } from "@/services/Common";

const apiTheses = axios.create({
  baseURL: import.meta.env.VITE_APP_API,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

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
function queryThesesAPI(query, facetsRequest, currentPage, currentShowingNumber, currentTri) {
  const url = "/recherche/simple/?q=" + encodeURIComponent(query) + "&debut=" + ((currentPage - 1) * currentShowingNumber) + "&nombre=" + currentShowingNumber + "&tri=" + currentTri + facetsRequest;

  return new Promise((resolve, reject) => {
    apiTheses.get(url)
      .then((response) => {
      resolve(response.data);
    }).catch((err) => {
      reject(err);
    });
  });
}

//Autcomplétion recherche simple
// #TODO gérer les erreurs
function suggestionTheses(query) {
  return apiTheses.get("/recherche/completion/?q=" + encodeURIComponent(replaceAndEscape(query)));
}

/**
 * Récupération des facettes pour une requête donnée
 * @param query
 * @returns {Promise<AxiosResponse<any>>}
 */
// #TODO gérer les erreurs
function getFacetsTheses(query, facetsRequest) {
  return apiTheses.get("/recherche/facets/?q=" + encodeURIComponent(replaceAndEscape(query)) + facetsRequest);
}

/**
 * Récupération des infos détaillées d'une theses
 * @param nnt
 * @returns {Promise<AxiosResponse<any>>}
 */
// #TODO gérer les erreurs
function getThese(nnt) {
  return apiTheses.get("/recherche/these/" + nnt);
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

/**
 * Service lié aux thèses
 * @returns {{rechercherPersonne: ((function(*): Promise<AxiosResponse<*>>)|*), listePersonnes: Ref<UnwrapRef<{}>>, selectedDomain: Ref<UnwrapRef<string>>, modifierDomaine: modifierDomaine}}
 */
export function thesesAPIService() {
  return {
    queryThesesAPI,
    suggestionTheses,
    getFacetsTheses,
    getThese,
    getItemsTriTheses,
    disableOrFiltersTheses
  };
}