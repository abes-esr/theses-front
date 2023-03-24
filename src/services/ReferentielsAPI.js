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
    return langueObj ? langueObj.label : code;
  } else {
    return code;
  }
}

export function referentielsAPIService() {
  return {
    fetchCodeLangues,
    createLabels
  };
}