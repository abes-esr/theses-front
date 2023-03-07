import axios from 'axios'
import {ref} from "vue";

const apiTheses = axios.create({
    baseURL: import.meta.env.VITE_APP_API,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

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

/**
 * Fonction pour rechercher des personnes à partir d'un mot.
 * La liste des personnes courantes est mises à jour.
 * @param query
 * @returns {Promise<unknown>}
 */
async function rechercherPersonne(query) {
    if (query === "")
        query = "*";
    return new Promise((resolve, reject) => {
        apiTheses.get("/personnes/recherche", {params: {"q": encodeURI(query.replace(" OU "," OR ").replace(" ET "," AND ").replace(" SAUF "," NOT "))}}).then((response) => {
            resolve(response.data);
        }).catch((err) => {
            reject(err);
        });
    });
}

/**
 * Fonction pour rechercher des suggestions de personnes à partir d'un mot.
 * La liste des suggestions de personnes.
 * @param query
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
 * Fonction pour récupérer les informations d'une personne à partir de son identifiant.
 * @param id : Identifiant de la personne
 * @returns {Promise<unknown>}
 */
async function getPersonne(id) {
    return new Promise((resolve, reject) => {
        apiTheses.get("/personnes/personne/"+id).then((response) => {
            resolve(response.data);
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
        getPersonne
    };
}