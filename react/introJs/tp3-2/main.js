function getSum(tab) {
    let resp = 0;
    if (tab instanceof Array) {
        tab.map((x) => {
            resp += x;
        });
    }
    return resp;
}
const tab = [100];
const sum = getSum(tab);

console.log(sum);