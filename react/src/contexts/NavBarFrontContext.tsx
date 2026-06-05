import { createContext, useState, type ReactNode } from "react";

export interface NavBarFrontContextType {
    productCount: number;
    setProductCount: (count: number) => void;
}
export const NavBarFrontContext = createContext<NavBarFrontContextType | null>(null);

export function NavBarFrontProvider({ children }: { children: ReactNode }) {
    const [productCount, setProductCount] = useState(0);

    return (
        <NavBarFrontContext.Provider value={{ productCount, setProductCount }}>
            {children}
        </NavBarFrontContext.Provider>
    );
}