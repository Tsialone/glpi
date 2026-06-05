import type INCategory from "./category";

export interface INArticle {
    id: number;
    name: string;
    description: string;
    category: INCategory
}
export interface INCreateArticle extends Partial<INArticle> {
    idCategory:number
}