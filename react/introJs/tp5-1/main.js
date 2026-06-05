function getMajor(tab) {
    if (tab instanceof Array && tab.length > 0) {
        const sorted = tab.toSorted((etud1, etud2) => { return etud2.note - etud1.note });
        return sorted[0];
    }
    return null;
}
const etudiants = [
    { 'nom': "Alice", 'note': 12 },
    { 'nom': "Brenda", 'note': 4 },
    { 'nom': "Sisoko", 'note': 3 },
    { 'nom': "Bob", 'note': 12},
];
const major = getMajor (etudiants);

console.log(major);