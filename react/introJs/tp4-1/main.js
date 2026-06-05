function filterOddsNumber(tab) {
    let resp = [];
    if (tab instanceof Array) {
        for (const number of tab) {
            if (number % 2 == 0) resp.push(number);
        }
    }

    return resp;
}

const tab = [1,2,3,4,5];
console.log (filterOddsNumber (tab));