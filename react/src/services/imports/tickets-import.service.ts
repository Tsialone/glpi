import type { LocalFile } from "papaparse";
import type { ITicketImport } from "../../types/import/tickets-import";
import { makeImport } from "../../functions/csv";
import { DateTime } from "luxon";
import { parseDate } from "../../utils/parse.util";

class TicketsImportService {
    csvHeaders: string[] = ["ref_ticket", "date", "heure", "type", "titre", "description", "status", "priority", "items"];


    parseCsv = async (products: ITicketImport[]): Promise<ITicketImport[]> => {
        let resp: ITicketImport[] = [];
        if (products instanceof Array) {
            for (const product of products) {
                const temp: ITicketImport = {
                    ...product
                };
                temp.items_array = [...new Set(this.parseItems(temp.items))];
                resp.push(temp);
            }
        }
        return resp;
    }
    parseItems(jsonString: string): string[] {
        return JSON.parse(jsonString);
    }

    async getByCsv(file: LocalFile) {
        try {
            const csv = await makeImport<ITicketImport>(
                file,
                this.transformImportValue,
                this.transformHeader,
                this.parseCsv
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
            throw new Error(`Header different ou manquant dans tiket: ${header}`);

        }
        return normalisedHeader;
    }

    transformImportValue = (value: string, column: string | number) => {
        if (column === "date") {
            const date = DateTime.fromFormat(value.trim(), 'dd/MM/yyyy');
            // console.log('valid?: ', date);
            if (!date.isValid) throw new Error(`Date non valide ticket: ${value}`);
            return value;
        }
        return value;
    }
}

export const ticketsImportService = new TicketsImportService();
