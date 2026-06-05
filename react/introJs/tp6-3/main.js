function generateCombinaison(tab) {
    let resp = [];
    for (let i = 0; i < tab.length; i++) {
        const elementI = tab[i];
        for (let j = 0; j < tab.length ; j++) {
            const elementJ = tab[j];
            // console.log (elementI ,  elementJ);
            resp.push(elementI + elementJ);
        }

    }
    return resp;
}
const test = ["A" , "B" , "C"];
const resp = generateCombinaison (test);
console.log (resp);