export function scrollToTop() {
  window.scrollTo(0, 0);
}

const listKeywordsAndChars = {
  " ET ":" AND ",
  " OU ": " OR ",
  " SAUF ": " NOT ",
  "+": "\\+",
  "-": "\\-",
  "!": "\\!",
  "&": "\\&",
  "|": "\\|",
  "(": "\\(",
  ")": "\\)",
  "{": "\\{",
  "}": "\\}",
  "[": "\\[",
  "]": "\\]",
  "^": "\\^",
  "~": "\\~",
  "?": "\\?",
  ":": "\\:"
}

export function replaceAndEscape(q) {
  q = deleteUnevenQuotes(q);
    for(const [key, value] of Object.entries(listKeywordsAndChars)){
      q = remplacerMotsCles(q, q, key, value, 0);

    }
    return q;
}

function remplacerMotsCles(q, ref,  motCle,  nouveauMotCle, limit) {
  limit++;
  if (limit > 1000) {
    return q;
  }
  let index = q.indexOf(motCle);
  if (index >= 0) {
    let indexRef = index + (ref.length - q.length);
    let nombreGuillemets = ref.substring(0, indexRef).split('"').length -1;
    if (nombreGuillemets % 2 == 0) {
      q = q.substring(0, index) + nouveauMotCle + q.substring(index + motCle.length);
      return q.substring(0, index + 2) +
        remplacerMotsCles(q.substring(index + 2), ref, motCle, nouveauMotCle, limit);
    } else {
      let indexProchainGuillemets = q.substring(index).indexOf("\"") + index + 1;
      return q.substring(0, indexProchainGuillemets) +
        remplacerMotsCles(q.substring(indexProchainGuillemets), ref, motCle, nouveauMotCle, limit);
    }
  }
  return q;
}

//Supprimme les double-quotes si elles sont en nombre impair (sinon ES n'accepte pas la requête)
function deleteUnevenQuotes(q) {
  let nbQuotes = q.split('"').length - 1;
  if((nbQuotes % 2) !== 0) {
    q = q.replaceAll('"', '');
  }
  return q;
}