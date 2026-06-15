import { max } from "date-fns";
import { id } from "date-fns/locale";
import { DateTime } from "luxon";

function getDublicate(tab: string[]) {
    const uniques = [...new Set(tab)];
    const duplicate = uniques.length !== tab.length;
    if (duplicate) {
        for (let i = 0; i < tab.length; i++) {
            const elementI = tab[i];
            for (let j = i + 1; j < tab.length; j++) {
                const elementJ = tab[j];
                if (elementI === elementJ) return elementJ;
            }
        }
    }
    return null;
}
// const test = ["1" , "4" , "3" , "1"];
// console.log (getDublicate (test));

interface INItemPosition {
    id: number;

    type: string;
    id_ticket: number;
    position: number
}

const temp = {
    1: "Test1",
    2: "Test2",
}
const arry = Object.entries(temp).map(
    ([key, value]) => console.log(key, ":", value)
);
// console.log (arry);
interface Product {
    id:number ,
    category:string,
    prix:number
}
const objs : Product [] = [
    { id: 1, category: "A", prix: 12 },
    { id: 2, category: "A", prix: 2 },
    { id: 3, category: "C", prix: 20 },
    { id: 4, category: "C", prix: 8 }

] ;
// console.log (allObj);
const record : Record<number , Product> = objs.reduce((acc, item) => {
    // console.log (a,ac);
    // a['id'] = ac.id;
    acc[item.id] =   item;
    return acc;
}, {} as Record<number, Product>);

const jojo = Object.groupBy (objs ,  (r) => r.category )

console.log(jojo);


const gogo = null;

if (gogo === null){
    console.log ("isNull");
}
const dateA = DateTime.fromFormat ("19-02-2005" , "dd-MM-yyyy");
console.log (dateA.toFormat ("dd-MM-yyyy"));