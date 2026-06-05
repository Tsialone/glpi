function findDuplicated(tab) {
    let resp = [];
    for (let i = 0; i < tab.length; i++) {
        const elementI = tab[i];
        if (resp.includes (elementI)) continue;
        for (let j = i + 1; j < tab.length - 1; j++) {
            const elementJ = tab[j];
            if (elementI === elementJ) { 
                resp.push(elementI);
                break;
            }
        }

    }
    return resp;
}
const tab = [7, 7, 7];
console.log(findDuplicated(tab));