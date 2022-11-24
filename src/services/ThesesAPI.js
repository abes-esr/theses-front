import axios from 'axios'
import {ref} from "vue";

const apiTheses = axios.create({
    baseURL: import.meta.env.VITE_APP_API,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

// Domaine courant
let selectedDomain = ref('theses');
//Page courante
let currentPage = ref(1);
//Nomre courant
let currentNombre = ref(10);
// Listes des personnes courantes
let listePersonnes = ref({});

/**
 * Fonction pour modifier la valeur du domaine courant
 * @param value Domaine courant
 */
function modifierDomaine(value) {
    selectedDomain.value = value;
}

function modifierPage(value) {
    currentPage.value = value;
}

function modifierNombre(value) {
    currentNombre.value = value;
}


// Recherche simple dans les theses
function rechercherThese(query) {
    return apiTheses.get("/recherche-java/titre/?q=" + query + "&page=" + (currentPage.value - 1) + "&nombre=" + currentNombre.value);
}

//Autcomplétion recherche simple
function complete(query) {
    return apiTheses.get("/recherche-java/completion/?q=" + query);
}

//Récupération des infos détaillées d'une theses
function getThese(nnt) {
    return apiTheses.get("/recherche-java/these/" + nnt);
}

/**
 * Fonction pour rechercher des personnes à partir d'un mot.
 * La liste des personnes courantes est mises à jour.
 * @param query
 * @returns {Promise<unknown>}
 */
async function rechercherPersonne(query) {
    return new Promise((resolve, reject) => {
        apiTheses.get("/personne/rechercher", {params: {"q": query}}).then((response) => {
            listePersonnes = response.data;
            resolve(true);
        }).catch((err) => {
            reject(err);
        });
    });
}

/**
 * Service lié aux thèses
 * @returns {{rechercherPersonne: ((function(*): Promise<AxiosResponse<*>>)|*), listePersonnes: Ref<UnwrapRef<{}>>, selectedDomain: Ref<UnwrapRef<string>>, modifierDomaine: modifierDomaine}}
 */
export function thesesAPIService() {
    return {
        selectedDomain,
        modifierDomaine,
        modifierPage,
        modifierNombre,
        listePersonnes,
        rechercherPersonne,
        rechercherThese,
        complete,
        getThese
    };
}