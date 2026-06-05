const additionner = (a, b) => { return a + b; }
const multiplier = (nombre, facteur) => { return nombre * facteur; }

const afficherResultat = (nombre) => { console.log("Résultat: ", nombre) }

afficherResultat(multiplier(additionner(5, 3), 2));