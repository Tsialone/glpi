const doubleArray = (tab) => {
    if (tab instanceof Array)return  tab.map((value , index  , array) => { return value * 2; });
};


const nombres = [1, 2, 3, 4, 5];
const newNombres = doubleArray(nombres);
console.log (newNombres);