import axios from 'axios'
import { replaceAndEscape } from "@/services/Common";

const apiPersonnes = axios.create({
    baseURL: import.meta.env.VITE_APP_API,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

/**
 * Fonction pour rechercher des personnes à partir d'un mot.
 * La liste des personnes courantes est mises à jour.
 * @param query
 * @param facets
 * @param currentPage
 * @param currentShowingNumber
 * @param currentTri
 * @returns {Promise<unknown>}
 */
async function queryPersonnesAPI(query, facetsRequest, currentPage, currentShowingNumber, currentTri) {
    const url = "/personnes/recherche/?q=" + encodeURIComponent(query) + "&debut=" + ((currentPage - 1) * currentShowingNumber) + "&nombre=" + currentShowingNumber + "&tri=" + currentTri + facetsRequest;

    return new Promise((resolve, reject) => {
        apiPersonnes.get(url)
          .then((response) => {
            resolve(response.data); // #TODO à rectifier après normalisation
        }).catch((err) => {
            reject(err);
        });
    });
}

/**
 * #TODO
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
        apiPersonnes.get("/personnes/completion", {params: {"q": encodeURI(query)}}).then((response) => {
            resolve(response.data);
        }).catch((err) => {
            reject(err);
        });
    });
}

/**
 * Récupération des facettes pour une requête donnée  #TODO implémenter route /personne/facets Fabien Théo ajouter le nom de la route
 * @param query
 * @returns {Promise<AxiosResponse<any>>}
 */
function getFacetsPersonnes(query) {
    return apiPersonnes.get("/personnes/facets?q=" + encodeURIComponent(replaceAndEscape(query)));
}

/**
 * Fonction pour récupérer les informations d'une personne à partir de son identifiant.
 * @param id : Identifiant de la personne
 * @returns {Promise<unknown>}
 */
async function getPersonne(id) {
    return new Promise((resolve, reject) => {
        apiPersonnes.get("/personnes/personne/" + id).then((response) => {
            const item = response.data;

            const stats = {
                auteur: 0,
                directeur: 0,
                president: 0,
                rapporteur: 0,
                jury: 0
            }

            item.theses.forEach(these => {
                if (these.role === "auteur") {
                    stats.auteur += 1;
                } else if (these.role === "directeur de thèse") {
                    stats.directeur += 1;
                } else if (these.role === "président du jury") {
                    stats.president += 1;
                } else if (these.role === "rapporteur") {
                    stats.rapporteur += 1;
                } else if (these.role === "membre du jury") {
                    stats.jury += 1;
                }
            })
            resolve({
                ...item,
                statistiques: stats
            });
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


/**
 * Service lié aux personnes
 */
export function personnesAPIService() {
    return {
        queryPersonnesAPI,
        suggestionPersonne,
        getFacetsPersonnes,
        getPersonne,
        getItemsTriPersonnes,
        disableOrFiltersPersonnes,
        getItemsTriMapPersonnes
    };
}