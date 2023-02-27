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
  if (filters.includes("soutenues") && filters.includes("enCours")) {
    return filters.filter(e => e !== "soutenues").filter(e => e !== "enCours").filter(e => e !== "accessible");
  } else {
    return filters;
  }
}

// Recherche simple dans les theses
function rechercherThese(query) {
  if (query === "")
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

  let mockupJSON = {
    "data":
      [
        {
          "name": "statut",
          "type": "drawer",
          "search-bar": false,
          checkboxes: [
            {
              "name": "soutenue",
              "value": 19229,
              checkboxes: [
                {
                  "parentName": "soutenue",
                  "name": "Accessible en ligne",
                  "value": 5591
                }
              ]
            },
            {
              "name": "En cours",
              "value": 55,
              children: [],
            }
          ]
        },
        {
          "name": "Etablissements",
          "type": "drawer",
          "checkboxes": [
            {
              "name": "Lyon 1",
              "value": 987
            },
            {
              "name": "Strasbourg",
              "value": 541
            },
            {
              "name": "Paris 6",
              "value": 2223
            },
            {
              "name": "Nantes",
              "value": 561
            },
            {
              "name": "Bordeaux 1",
              "value": 966
            },
            {
              "name": "Paris 11",
              "value": 1446
            },
            {
              "name": "Rennes 1",
              "value": 676
            },
            {
              "name": "Montpellier 2",
              "value": 1045
            },
            {
              "name": "Toulouse 3",
              "value": 770
            },
            {
              "name": "Strasbourg 1",
              "value": 837
            }
          ]
        },
        {
          "name": "Disciplines",
          "type": "drawer",
          "search-bar": true,
          "checkboxes": [
            {
              "name": "chimie physique",
              "value": 230
            },
            {
              "name": "chimie analytique",
              "value": 275
            },
            {
              "name": "chimie organique",
              "value": 1420
            },
            {
              "name": "chimie des materiaux",
              "value": 585
            },
            {
              "name": "chimie - physique",
              "value": 682
            },
            {
              "name": "physique",
              "value": 357
            },
            {
              "name": "chimie organique, minerale, industrielle",
              "value": 364
            },
            {
              "name": "chimie moleculaire",
              "value": 168
            },
            {
              "name": "chimie-physique",
              "value": 195
            },
            {
              "name": "chimie",
              "value": 6095
            }
          ]
        },
        {
          "name": "Langues",
          "type": "drawer",
          "search-bar": true,
          "checkboxes": [
            {
              "name": "cs",
              "value": 4
            },
            {
              "name": "ru",
              "value": 4
            },
            {
              "name": "pt",
              "value": 27
            },
            {
              "name": "en",
              "value": 1622
            },
            {
              "name": "enfr",
              "value": 695
            },
            {
              "name": "it",
              "value": 8
            },
            {
              "name": "fr",
              "value": 17099
            },
            {
              "name": "ro",
              "value": 9
            },
            {
              "name": "es",
              "value": 28
            },
            {
              "name": "zh",
              "value": 5
            }
          ]
        }
      ]
  };

  return new Promise((resolve) => {
    resolve(mockupJSON);
  });

  // const facets = apiTheses.get("/recherche-java/facets/?q=" + encodeURIComponent(query));
  // console.log("Réponse API facettes : ")
  // console.log(facets)
  // return facets;
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