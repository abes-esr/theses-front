import axios from "axios";
import { ref } from "vue";

const apiRef = axios.create({
  baseURL: import.meta.env.VITE_APP_APIREF,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

const codesLangue = ref({});

/**
 * Peuplement liste langues - un seul appel par instance
 * @returns {Promise<AxiosResponse<any>>}
 */
function fetchCodeLangues() {
  if(Object.keys(codesLangue.value).length === 0) {
    return apiRef.get("iso639-2B.json").then((res) => {
        codesLangue.value = res.data;
    });
  }
}

/**
 * Transforme le caractère suivant un caractère qui n'est pas en alphanumérique (alinéa, espace etc) en majuscule
 * Tri sur la valeur de Character.getType() - seuil = 9
 * @param name
 */
function capitalize(name) {
  if (typeof name === 'undefined' || name === '') return name;

  let converted = '';
  let convertNext = true;
  const nameCharArray = name.split('');

  for (let ch of nameCharArray) {
    if (containsSpecialChar(ch)) {
      convertNext = true;
    } else if (convertNext) {
      ch = ch.toUpperCase();
      convertNext = false;
    } else {
      ch = ch.toLowerCase();
    }

    converted += ch;
  }

  return converted;
}

function containsSpecialChar(name) {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\ ]/;
  return specialChars.test(name);
}

function createLabels(facetsData) {
  facetsData.forEach((facet) => {
    if (facet.name === 'Langues') {
      facet.checkboxes.forEach((checkbox) => { checkbox.label = getLabelFromCode(checkbox.name) });
    }
  });

  return facetsData;
}

function getLabelFromCode(code) {
  if (Object.keys(codesLangue.value).length > 0) {
    let langueObj = codesLangue.value.find(o => o.codecourt === code);
    return langueObj ? capitalize(langueObj.label) : code;
  } else {
    return code;
  }
}

export function referentielsAPIService() {
  return {
    fetchCodeLangues,
    createLabels,
    getLabelFromCode
  };
}