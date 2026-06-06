import type { IDocument } from "../types/document";
import type { IAssetImport } from "../types/import/assets-import";
import { ITEM_TYPE } from "../utils";
import type { ExtractedImage } from "../utils/upload.util";
import { itemModelService } from "./item-model.service";
import { MethodeService } from "./methode.service";

class DocumentService extends MethodeService {
    private endpoint = "Document";
    async createsByextractedImages(extractedImages: ExtractedImage[]): Promise<void> {
        for (const image of extractedImages) {
            console.log ("Importion de" , image , " .....");
            await this.create(image)
        }
    }

    async getAll() {
        return await this.get<IDocument[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<IDocument>(`${this.endpoint}/${id}`);
    }

    async create(extractedImage: ExtractedImage) {
        const formData = new FormData();
        const filename = extractedImage.name.split (".")[0] + ".jpeg";

        const uploadManifest = {
            input: {
                name: filename,
                _filename: [filename]
            }
        };

        formData.append("uploadManifest", JSON.stringify(uploadManifest));
        formData.append("filename[0]", extractedImage.blob , filename);

        try {
            const result = await this.defaultApiClient.post(this.endpoint, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return result.data;
        } catch (error: any) {
            if (error.response?.data) {
                const data = error.response.data;
                console.error("erreur upload: ", data.message);
                throw new Error(data.message || "Erreur lors de l'upload");
            }
            throw error;
        }
    }

    async update(id: number, data: Partial<IDocument>) {
        return await this.put(`${this.endpoint}/${id}`, { id, ...data });
    }

    async delete(id: number) {
        return await this.del(this.endpoint, id);
    }

    async purge() {
        const ids = (await this.getAll()).map(o => o.id);
        console.log (ids);
        return await this.reset(this.endpoint, ids);
    }
}

export const documentService = new DocumentService();
