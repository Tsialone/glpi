class Personne {
    constructor(nom, age, email, ville) {
        this.nom = nom;
        this.age = age;
        this.email = email;
        this.ville = ville;
    }
}
function Card (nom) {
    this.nom  = nom;
}
const alice = new Personne("Alice", 19, "coco", "ville");
const card = new Card ("toto");