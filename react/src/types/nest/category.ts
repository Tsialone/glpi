import type { INArticle } from "./article";

export default interface INCategory {
    id: number

    name: string

    created: Date;

    articles:INArticle []
}