import axios from "axios";
import { replaceAndEscape } from "@/services/Common";

const apiTheses = axios.create({
  baseURL: import.meta.env.VITE_APP_API,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});



// Les status "soutenue" et "en cours" s'annulent
function disableOrFilters(filters) {
  if (filters.includes("soutenues") && filters.includes("enCours")) {
    return filters.filter(e => e !== "soutenues").filter(e => e !== "enCours").filter(e => e !== "accessible");
  } else {
    return filters;
  }
}

// Recherche simple dans les theses
function queryThesesAPI(query, facets, currentPage, currentNombre, currentTri) {
  const facetsRequest = facets
    ? "&filtres=" + encodeURIComponent("[" + disableOrFilters(facets.value).toString() + "]")
    : "";

  const url = "/recherche-java/simple/?q=" + encodeURIComponent(replaceAndEscape(query.value)) + "&debut=" + ((currentPage - 1) * currentNombre) + "&nombre=" + currentNombre + "&tri=" + currentTri + facetsRequest;

  return new Promise((resolve, reject) => {
    apiTheses.get(url).then((response) => {
      resolve(response.data);
    }).catch((err) => {
      reject(err);
    });
  });
}

//Autcomplétion recherche simple
function suggestionTheses(query) {
  return apiTheses.get("/recherche-java/completion/?q=" + encodeURIComponent(replaceAndEscape(query)));
}

/**
 * Récupération des facettes pour une requête donnée
 * @param query
 * @returns {Promise<AxiosResponse<any>>}
 */
function getFacetsTheses(query) {
  const facets = apiTheses.get("/recherche-java/facets/?q=" + encodeURIComponent(replaceAndEscape(query)));
  return facets;
}

/**
 * Récupération des infos détaillées d'une theses
 * @param nnt
 * @returns {Promise<AxiosResponse<any>>}
 */
function getThese(nnt) {
  return apiTheses.get("/recherche-java/these/" + nnt);
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
    getThese
  };
}