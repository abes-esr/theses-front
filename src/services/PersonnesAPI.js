import axios from 'axios'
import { replaceAndEscape } from "@/services/Common";

const apiTheses = axios.create({
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
 * @param currentNombre
 * @param currentTri
 * @returns {Promise<unknown>}
 */
async function queryPersonnesAPI(query, facets, currentPage, currentNombre, currentTri) {
    return new Promise((resolve, reject) => {
        apiTheses.get("/personnes/recherche", {params: {"q": encodeURI(query.replace(" OU ", " OR ").replace(" ET ", " AND ").replace(" SAUF ", " NOT "))}}).then((response) => {
            resolve(response.data);
        }).catch((err) => {
            reject(err);
        });
    });
}

/**
 * Fonction pour rechercher des suggestions de personnes à partir d'un mot.
 * La liste des suggestions de personnes.
 * @returns {Promise<unknown>}
 */
async function suggestionPersonne(query) {
    return new Promise((resolve, reject) => {
        apiTheses.get("/personnes/completion", {params: {"q": encodeURI(query)}}).then((response) => {
            resolve(response.data);
        }).catch((err) => {
            reject(err);
        });
    });
}

/**
 * Récupération des facettes pour une requête donnée #TODO Fabien Théo ajouter le nom de la route
 * @param query
 * @returns {Promise<AxiosResponse<any>>}
 */
function getFacetsPersonnes(query) {
    const facets = apiTheses.get("/recherche-java/facets/?q=" + encodeURIComponent(replaceAndEscape(query))); // #TODO implémenter route /personne/facets
    return facets;
}

/**
 * Fonction pour récupérer les informations d'une personne à partir de son identifiant.
 * @param id : Identifiant de la personne
 * @returns {Promise<unknown>}
 */
async function getPersonne(id) {
    return new Promise((resolve, reject) => {
        apiTheses.get("/personnes/personne/" + id).then((response) => {
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

/**
 * Service lié aux personnes
 */
export function personnesAPIService() {
    return {
        queryPersonnesAPI,
        suggestionPersonne,
        getFacetsPersonnes,
        getPersonne
    };
}