class  Voiture {
    constructor (marque , modele , annee){
        this.marque  = marque;
        this.modele = modele;
        this.setAnnee (annee);
    }
    setAnnee (annee){
        const isNumber = typeof annee === 'number';
        if (annee == null) throw Error ("Annee ne doit pas etre null");
        if (!isNumber) throw new Error ("Annnee doit etre un nombre");
        this.annee = annee;
    }
    demarrer (){
        return "Tesla démarre";
    }
    arreter (){
        return "Tesla s'arrếte";
    }
}

try {
    const voiture = new Voiture ("Tesla" , "Model 3" , 99);
    console.log (voiture.demarrer ());
} catch (error ) {
        console.log ("Erreur: " + error.message);
}