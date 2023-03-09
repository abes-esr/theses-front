import axios from 'axios'
import {ref} from "vue";

const apiTheses = axios.create({
    baseURL: import.meta.env.VITE_APP_API,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

const query = ref("");
//Page courante
let currentPage = ref(1);
//Nomre courant
let currentNombre = ref(10);

function modifierPage(value) {
    currentPage.value = value;
}

function modifierNombre(value) {
    currentNombre.value = value;
}

function setQueryPersonnes(newQuery) {
    query.value = newQuery ? newQuery : "*";
}

/**
 * Fonction pour rechercher des personnes à partir d'un mot.
 * La liste des personnes courantes est mises à jour.
 * @param query
 * @returns {Promise<unknown>}
 */
async function rechercherPersonne() {
    return new Promise((resolve, reject) => {
        apiTheses.get("/personnes/recherche", {params: {"q": encodeURI(query.value.replace(" OU ", " OR ").replace(" ET ", " AND ").replace(" SAUF ", " NOT "))}}).then((response) => {
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
async function suggestionPersonne() {
    return new Promise((resolve, reject) => {
        apiTheses.get("/personnes/completion", {params: {"q": encodeURI(query.value)}}).then((response) => {
            resolve(response.data);
        }).catch((err) => {
            reject(err);
        });
    });
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
        modifierPage,
        modifierNombre,
        rechercherPersonne,
        suggestionPersonne,
        getPersonne,
        setQueryPersonnes
    };
}