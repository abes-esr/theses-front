import { ref } from "vue";
import { useReferentielFetch } from "./useReferentielFetch";

const codesLangue = ref([]);

/**
 * Peuplement liste langues - un seul appel par instance
 * @returns {Promise<>}
 */
function fetchCodeLangues() {
  if(!codesLangue.value || Object.keys(codesLangue.value ?? {}).length === 0) {
    return useReferentielFetch("iso639-2B.json").then((res) => {
        codesLangue.value = res.data.value ?? [];
      }).catch(() => {
        codesLangue.value = [];
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
      facet = sortByLanguageName(facet);
    }
  });

  return facetsData;
}

function getLabelFromCode(code) {
  if (Array.isArray(codesLangue.value) && codesLangue.value.length > 0) {
    let langueObj = codesLangue.value.find(o => o.codecourt === code);
    return langueObj ? capitalize(langueObj.label) : code;
  }
}

// Trier par ordre alphabétique
function sortByLanguageName(data) {
  // Gérer le cas où data est vide ou checkboxes n'existe pas
  if (!data || !data.checkboxes || data.checkboxes.length === 0) {
    return data;
  }

  data.checkboxes.sort((a, b) => {
    // Ne rien faire si a.label ou b.label n'existent pas
    if (!a.label || !b.label) {
      return 0;
    }
    return a.label.localeCompare(b.label, "fr");
  });

  return data;
}

export default function () {
  return {
    fetchCodeLangues,
    createLabels,
    getLabelFromCode
  };
}