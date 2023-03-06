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

//Peuplement liste langues
function fetchCodeLangues() {
    apiRef.get("iso639-2B.json").then((res) => {
        codesLangue.value = res.data;
    });
}

export function referentielsAPIService() {
  return {
    codesLangue,
    fetchCodeLangues
  };
}