function isBetween(interval, x) {
    return x >= interval[0] && x <= interval[1];
}
function getMention(moyenne) {
    const mention = {
         "Très faible": [ 0 , 5],
         "Faible": [6, 10],
         "Bien": [11, 14],
         "Très bien": [5, 18],
         "Excellent": [19, 20]
    };
    for (const key in mention) {
        if (!Object.hasOwn(mention, key)) continue;
        
        const element = mention[key];
        if (isBetween (element , moyenne)) return key;
    }
}
const tab = [3,9,12,16,19];
for (const moyenne of tab) {
        console.log (getMention (moyenne));
}