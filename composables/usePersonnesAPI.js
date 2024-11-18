import { replaceAndEscape } from "../services/Common";
import { useAPIFetch } from "./useAPIFetch";

/**
 * Fonction pour rechercher des personnes à partir d'un mot.
 * La liste des personnes courantes est mises à jour.
 * @param query
 * @param facets
 * @param currentPageNumber
 * @param currentShowingNumber
 * @param currentSorting
 * @returns {Promise<unknown>}
 */
async function queryPersonnesAPI(query, facetsRequest, currentPageNumber, currentShowingNumber, currentSorting) {
    const url = "/personnes/recherche/?q=" + encodeURIComponent(query) + "&debut=" + ((currentPageNumber - 1) * currentShowingNumber) + "&nombre=" + currentShowingNumber + "&tri=" + currentSorting + facetsRequest;

    return new Promise((resolve, reject) => {
        useAPIFetch(url)
          .then((response) => {
            resolve(response.data.value); // #TODO à rectifier après normalisation
        }).catch((err) => {
            reject(err);
        });
    });
}

/**
 * @param facets
 * @returns {*}
 */
function disableOrFiltersPersonnes(facets) {
    return facets;
}

/**
 * Fonction pour rechercher des suggestions de personnes à partir d'un mot.
 * La liste des suggestions de personnes.
 * @returns {Promise<unknown>}
 */
async function suggestionPersonne(query) {
    return new Promise((resolve, reject) => {
        useAPIFetch("/personnes/completion", {params: {"q": encodeURI(query)}}).then((response) => {
            resolve(response.data.value);
        }).catch((err) => {
            reject(err);
        });
    });
}

/**
 * Récupération des facettes pour une requête donnée  #TODO implémenter route /personne/facets Fabien Théo ajouter le nom de la route
 * @param query
 * @returns {Promise<Response<any>>}
 */
function getFacetsPersonnes(query, facetsRequest) {
    return useAPIFetch("/personnes/facets?q=" + encodeURIComponent(replaceAndEscape(query)) + facetsRequest);
}

/**
 * Fonction pour récupérer les informations d'une personne à partir de son identifiant.
 * @param id : Identifiant de la personne
 * @returns {Promise<unknown>}
 */
async function getPersonne(id) {
    return new Promise((resolve, reject) => {
        useAPIFetch("/personnes/personne/" + id).then((response) => {
            resolve(response.data.value);
        }).catch((err) => {
            reject(err);
        });
    });
}
function getItemsTriPersonnes() {
    return [
        { nom: "Pertinence", cle: "pertinence" },
        { nom: "Personnes A-Z", cle: "PersonnesAsc" },
        { nom: "Personnes Z-A", cle: "PersonnesDesc" }
    ];
}

function getItemsTriMapPersonnes() {
    let itemsNamesMap = new Map();

    itemsNamesMap.set("pertinence", "Pertinence");
    itemsNamesMap.set("PersonnesAsc", "Personnes A-Z");
    itemsNamesMap.set("PersonnesDesc", "Personnes Z-A");

    return itemsNamesMap;
}

function getStatsPersonnes() {
    return useAPIFetch("/personnes/stats")
}


/**
 * Service lié aux personnes
 */
export default function () {
    return {
        queryPersonnesAPI,
        suggestionPersonne,
        getFacetsPersonnes,
        getPersonne,
        getStatsPersonnes,
        getItemsTriPersonnes,
        disableOrFiltersPersonnes,
        getItemsTriMapPersonnes
    };
}