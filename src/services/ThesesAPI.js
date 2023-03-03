import axios from "axios";
import { ref } from "vue";

const apiTheses = axios.create({
  baseURL: import.meta.env.VITE_APP_API,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

//Page courante
const currentPage = ref(1);
//Nombre de résultats par page
const currentNombre = ref(10);
//Tri
const currentTri = ref("pertinence");
const currentFiltres = ref([]);
const query = ref("");

function modifierPage(value) {
  currentPage.value = value;
}

function modifierNombre(value) {
  currentNombre.value = value;
}

function modifierTri(value) {
  currentTri.value = value;
}

function modifierFiltres(value) {
  currentFiltres.value = parseFiltersArray(value);
}

function setQuery() {
}

function parseFiltersArray(objectsArray) {
  let filtersArrayURL = [];

  objectsArray.forEach((filter) => {
    filtersArrayURL.push(Object.keys(filter)[0] + '="' + Object.values(filter)[0] + '"');
  });

  return filtersArrayURL.join('&').toLowerCase();
}

// Les status "soutenue" et "en cours" s'annulent
function disableOrFilters(filters) {
  if (filters.includes("soutenues") && filters.includes("enCours")) {
    return filters.filter(e => e !== "soutenues").filter(e => e !== "enCours").filter(e => e !== "accessible");
  } else {
    return filters;
  }
}

// Recherche simple dans les theses
function rechercherThese(query) {
  console.log(currentFiltres.value)
  const filtersRequest = currentFiltres.value
    ? "&filtres=" + encodeURIComponent("[" + disableOrFilters(currentFiltres.value).toString() + "]")
    : "";
  if (query === "")
    query = "*";

  const url = "/recherche-java/simple/?q=" + encodeURIComponent(query) + "&debut=" + ((currentPage.value - 1) * currentNombre.value) + "&nombre=" + currentNombre.value + "&tri=" + currentTri.value + filtersRequest;
  console.log("valeur du string dans l'url")
  console.log(url)
  return new Promise((resolve, reject) => {
    apiTheses.get(url).then((response) => {
      resolve(response.data);
    }).catch((err) => {
      reject(err);
    });
  });
}

//Autcomplétion recherche simple
function complete(query) {
  return apiTheses.get("/recherche-java/completion/?q=" + encodeURIComponent(query));
}

//Facets
async function getFacets(query) {

  const facets = apiTheses.get("/recherche-java/facets/?q=" + encodeURIComponent(query));
  console.log("Réponse API facettes : ")
  console.log(facets)
  return facets;
}

//Récupération des infos détaillées d'une theses
function getThese(nnt) {
  return apiTheses.get("/recherche-java/these/" + nnt);
}

/**
 * Service lié aux thèses
 * @returns {{rechercherPersonne: ((function(*): Promise<AxiosResponse<*>>)|*), listePersonnes: Ref<UnwrapRef<{}>>, selectedDomain: Ref<UnwrapRef<string>>, modifierDomaine: modifierDomaine}}
 */
export function thesesAPIService() {
  return {
    modifierPage,
    modifierNombre,
    modifierTri,
    modifierFiltres,
    rechercherThese,
    complete,
    getFacets,
    getThese
  };
}