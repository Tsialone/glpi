import { apiClient } from "../utils/api";



/**
 * Service pour toutes les opérations API
 * Ne dépend pas de React
 */
export class MethodeService {
    defaultApiClient = apiClient;


    async get<T = any>(url: string): Promise<T> {
        try {
            const result = await this.defaultApiClient.get<T>(url);
            return result.data;
        } catch (error: any) {
            if (error.response?.data) {
                throw new Error(error.response.data?.status || error.response.data?.detail || "Erreur lors de la récupération des données");
            }
            throw error;
        }
    }

    async del(endPoint: string, id: number, force: boolean = true) {
        try {
            await this.defaultApiClient.delete(`${endPoint}/${id}?force=${force}`);
        } catch (error: any) {
            if (error.response?.data) {
                const data = error.response.data;
                console.error("Erreur suppression: ", data.message);
                throw new Error(data.message || "Impossible de supprimer l'élément.");
            }
            throw error;
        }
    }

    // async reset(endPoints: string, ids: (number | string)[]) {
    //     for (const id of ids) {
    //         await this.del(endPoints, id);
    //     }
    // }
    async reset(endPoints: string, ids: number[]) {
        const promises = ids.map(id => this.del(endPoints, id));
        await Promise.all(promises);
    }

    async post<T = any>(endPoint: string, body: T) {
        try {
            const realBody = {"input" : body};  
            const result = await this.defaultApiClient.post(endPoint, realBody);
            return result.data;
        } catch (error: any) {
            if (error.response?.data) {
                const data = error.response.data
                console.error("erreur: ", data.message);
                throw new Error(data.message);
                // return error.response.data.message;
            }
            throw error;
        }
    }

    async put<T = any>(endPoint: string, body: T) {
        try {
            const result = await this.defaultApiClient.put(endPoint, body);
            return result.data;
        } catch (error: any) {
            if (error.response?.data) {
                const data = error?.response?.data
                console.error("erreur: ", data?.message);
                throw new Error(data.message);
            }
            throw error;
        }
    }

    async patch<T = any>(endPoint: string, body: T) {
        try {
            const result = await this.defaultApiClient.patch(endPoint, body);
            return result.data;
        } catch (error: any) {
            if (error.response?.data) {
                const data = error?.response?.data
                console.error("erreur: ", data?.message);
                throw new Error(data.message);
            }
            throw error;
        }
    }
}
