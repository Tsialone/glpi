function showMultiplicationTable (number , range){
    let resp =`${number} x 0 = 0 \n`;
    for (let index = 1; index <= range; index++) {
        resp += `${number} x ${index} = ${index * number} \n`;
    }

    return resp;
}

const resp = showMultiplicationTable (7 , 10000);
console.log (resp);