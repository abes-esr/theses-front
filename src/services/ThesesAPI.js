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
//Tri
let currentTri = ref("pertinence");

let currentFiltres = ref([]);

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
    currentFiltres.value = value;
}

// Recherche simple dans les theses
function rechercherThese(query) {
    return new Promise((resolve, reject) => {
        apiTheses.get("/recherche-java/simple/?q=" + encodeURIComponent(query) + "&debut=" + ((currentPage.value - 1)* currentNombre.value) + "&nombre=" + currentNombre.value + "&tri=" + currentTri.value + "&filtres=" + currentFiltres.value.toString()).then((response) => {
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
function getFacets(query) {
    return apiTheses.get("/recherche-java/facets/?q=" + encodeURIComponent(query));
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