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

// Les status soutenue et en cours s'annulent
function disableOrFilters(filters) {
    if(filters.includes("soutenues") && filters.includes("enCours")){
        return filters.filter(e => e !== 'soutenues').filter(e => e !== 'enCours').filter(e => e !== 'accessible');
    } else {
        return filters;
    }
}

// Recherche simple dans les theses
function rechercherThese(query) {
    if(query === "")
        query = "*";
    return new Promise((resolve, reject) => {
        apiTheses.get("/recherche-java/simple/?q=" + encodeURIComponent(query) + "&debut=" + ((currentPage.value - 1) * currentNombre.value) + "&nombre=" + currentNombre.value + "&tri=" + currentTri.value + "&filtres=" + disableOrFilters(currentFiltres.value).toString()).then((response) => {
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
  return apiTheses.get("/recherche-java/facets/?q=" + encodeURIComponent(query));
    let mockupJSON = {
      "data":
      {
        "langues": {
            "cs": 4,
              "ru": 4,
              "pt": 27,
              "en": 1622,
              "enfr": 695,
              "it": 8,
              "fr": 17099,
              "ro": 9,
              "es": 28,
              "zh": 5
        },
        "accessible": {
            "oui": 5591,
              "non": 13693
        },
        "etabSoutenanceN.exact": {
            "Lyon 1": 987,
              "Strasbourg": 541,
              "Paris 6": 2223,
              "Nantes": 561,
              "Bordeaux 1": 966,
              "Paris 11": 1446,
              "Rennes 1": 676,
              "Montpellier 2": 1045,
              "Toulouse 3": 770,
              "Strasbourg 1": 837
        },
        "discipline.tri": {
            "chimie physique": 230,
              "chimie analytique": 275,
              "chimie organique": 1420,
              "chimie des materiaux": 585,
              "chimie - physique": 682,
              "physique": 357,
              "chimie organique, minerale, industrielle": 364,
              "chimie moleculaire": 168,
              "chimie-physique": 195,
              "chimie": 6095
        },
        "status": {
            "soutenue": 19229,
              "enCours": 55
        }
      }
    };

    return new Promise((resolve) => {
        resolve(mockupJSON);
    })
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