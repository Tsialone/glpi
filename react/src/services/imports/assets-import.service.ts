import type { LocalFile } from "papaparse";
import type { IAssetImport } from "../../types/import/assets-import";
import { makeImport } from "../../functions/csv";
import { itemStateService } from "../item-state.service";
import { locationService } from "../location.service";
import { manufacturerService } from "../manufacturer.service";
import { itemModelService } from "../item-model.service";
import { userService } from "../user.service";
import type { ExtractedImage } from "../../utils/upload.util";
import { documentService } from "../document.service";
import { assetsService } from "../assets.service";

class AssetsImportService {
    csvHeaders: string[] = ["name", "status", "location", "manufacturer", "item_type", "model", "inventory_number", "user"];

    async doImport(assetsImport: IAssetImport[] , extractedImages : ExtractedImage []) {
        await itemStateService.createsByAssetImport(assetsImport);
        await locationService.createByIAssetImport(assetsImport);
        await manufacturerService.createsByAssetImport(assetsImport);
        await itemModelService.createsByAssetImport(assetsImport);
        await userService.createsByAssetImport(assetsImport);
        await documentService.createsByextractedImages (extractedImages);

        // insertion finale
        await assetsService.createsByAssetImport (assetsImport);
    }
    async getByCsv(file: LocalFile) {
        try {
            const csv = await makeImport<IAssetImport>(
                file as LocalFile,
                this.transImporttValue,
                this.transformHeader
            );
            // console.log(csv);
            return csv;
        } catch (error) {
            throw error;
        } finally {
        }
    }
    transformHeader = (header: string) => {
        const normalisedHeader = header.toLowerCase().trim();
        const alreadyMapped = this.csvHeaders.includes(normalisedHeader);
        if (!alreadyMapped) {
            throw new Error(`Header different ou manquant dans asset: ${header}`);

        }
        return normalisedHeader;
    }
    transImporttValue = (value: string, column: string | number) => {
        // if (column === "available_date") {
        //     const date = DateTime.fromFormat(value.trim(), 'dd/MM/yyyy');
        //     console.log('valid?: ', date);
        //     if (!date.isValid) throw new Error(`Date non valide produit: ${value}`);
        //     return value;
        // }
        // if (column === "taxe") {
        //     // console.log ('taxxxxxxxxxxxxxxxe: ' , value);
        //     const numberValue = Number(parsePourcentage(value));
        //     // console.log ('taxxxxxxxxxxxxxxxe: ' , numberValue);

        //     if (numberValue < -1) {
        //         throw new Error(`taxe negatif dans produits: ${numberValue}`);
        //     }
        //     return parsePourcentage(value);
        // };
        // if (column === "prix_ttc") {
        //     const numberValue = Number(parseNumber(value));
        //     if (numberValue < -1) {
        //         throw new Error(`prix_ttc negatif dans produits: ${numberValue}`);
        //     }
        //     return parseNumber(value);
        // }
        // if (column === "prix_achat") {
        //     const numberValue = Number(parseNumber(value));
        //     if (numberValue < -1) {
        //         throw new Error(`prix_achat negatif dans produits: ${numberValue}`);
        //     }
        //     return parseNumber(value);
        // }
        return value;
    }

}

export const assetsImportService = new AssetsImportService();
