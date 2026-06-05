import { useState } from "react";

export function  useNavBarFront (){
    const [productCount , setProductCount ] = useState (0);

    return {
        setProductCount,
        productCount
    }

}