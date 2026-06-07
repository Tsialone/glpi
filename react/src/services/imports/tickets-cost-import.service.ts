import type { LocalFile } from "papaparse";
import type { ITicketCostImport } from "../../types/import/tickets-cost-import";
import { makeImport } from "../../functions/csv";
import { parseNumber } from "../../utils/parse.util";
import { ticketCostService } from "../ticket-cost.service";

class TicketsCostImportService {
    csvHeaders: string[] = ["num_ticket", "duration_second", "time_cost", "fixed_cost"];
    async doImport(ticketCostImports: ITicketCostImport[]) {
        await ticketCostService.createByTicketCostImports(ticketCostImports);
    }
    // parseCsv = async (objects: ITicketCostImport[]): Promise<ITicketCostImport[]> => {
    //     let resp: ITicketCostImport[] = [];
    //     if (objects instanceof Array) {
    //         for (const object of objects) {
    //             const temp: ITicketCostImport = {
    //                 ...object
    //             };
    //             resp.push(temp);
    //         }
    //     }
    //     return resp;
    // }
    async getByCsv(file: LocalFile) {
        try {
            const csv = await makeImport<ITicketCostImport>(
                file,
                this.transformImportValue,
                this.transformHeader
            );
            return csv;
        } catch (error) {
            throw error;
        }
    }

    transformHeader = (header: string) => {
        const normalisedHeader = header.toLowerCase().trim();
        const alreadyMapped = this.csvHeaders.includes(normalisedHeader);
        if (!alreadyMapped) {
            throw new Error(`Header different ou manquant dans ticket-cost: ${header}`);

        }
        return normalisedHeader;
    }

    transformImportValue = (value: string, column: string | number) => {
        if (column === "time_cost") {
            const numberValue = Number(parseNumber(value));
            if (numberValue < -1) {
                throw new Error(`time_cost negatif dans ticket-cost: ${numberValue}`);
            }
            return parseNumber(value);
        }
        if (column === "fixed_cost") {
            const numberValue = Number(parseNumber(value));
            if (numberValue < -1) {
                throw new Error(`fixed_cost negatif dans ticket-cost: ${numberValue}`);
            }
            return parseNumber(value);
        }
        if (column === "duration_second") {
            const numberValue = Number(parseNumber(value));
            if (numberValue < -1) {
                throw new Error(`duration_second negatif dans ticket-cost: ${numberValue}`);
            }
            return parseNumber(value);
        }
        return value;
    }
}

export const ticketsCostImportService = new TicketsCostImportService();
