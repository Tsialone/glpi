import bcrypt from "bcryptjs";
import { DateTime } from "luxon";


// yyyy/MM/dd
export function getDateDuJourInternational() {
    const date = DateTime.now();
    const toDate = date.toFormat("yyyy-MM-dd HH:mm:ss");
    return toDate;
}

export function isDateValide(dateStr: string): boolean {
    const d = new Date(dateStr);

    // Si le timestamp est NaN, la date est invalide
    return !isNaN(d.getTime());
}
// import type { LocalFile } from "papaparse";
export function getProductHotBadge(dateSortie: string): string {
    const aujourdhui = new Date();
    const isValide = isDateValide(dateSortie);
    if (isValide) {
        const productDate = new Date(parseDate(dateSortie));
        // console.log("yoyoy: ", productDate);
        const differenceEnTemps = aujourdhui.getTime() - productDate.getTime();
        const differenceEnJours = differenceEnTemps / (1000 * 3600 * 24);

        if (differenceEnJours <= 1) {
            return "HOT";
        } else if (differenceEnJours <= 7) {
            return "NEW";
        } else {
            return "";
        }
    }
    return "date invalide";

}
export function ontMemeElements(arr1: string[], arr2: string[]): boolean {
    if (arr1.length !== arr2.length) return false;
    const set2 = new Set(arr2);
    return arr1.every(item => set2.has(item));
}
// Utilitaire qui "unwrap" récursivement les .value et .language?.value
type DeepUnwrap<T> = T extends { language?: { value: infer V } }
    ? V
    : T extends { value: infer V }
    ? V
    : T extends object
    ? { [K in keyof T]: DeepUnwrap<T[K]> }
    : T;

export function deepUnwrap<T extends object>(obj: T): DeepUnwrap<T> {
    const result: any = {};

    for (const key of Object.keys(obj) as (keyof T)[]) {
        const val = obj[key] as any;

        if (val && typeof val === "object") {
            if ("language" in val) {
                result[key] = val.language?.value ?? "";
            } else if ("value" in val) {
                result[key] = val.value;
            } else {
                result[key] = deepUnwrap(val);
            }
        } else {
            result[key] = val;
        }
    }

    return result as DeepUnwrap<T>;
}

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    try {
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;
    } catch (error) {
        console.error("Erreur lors de la vérification :", error);
        return false;
    }
};

export function getFileByNameCsv(names: string[], files: FileList | null): Record<string, File> {
    const resp: Record<string, File> = {};

    if (files && files.length > 0) {
        const normalizedSearchNames = names.map(n => n.toLowerCase().trim());

        for (const file of Array.from(files)) {
            const lastDotIndex = file.name.lastIndexOf('.');
            const fileNameNoExtension = lastDotIndex !== -1
                ? file.name.substring(0, lastDotIndex)
                : file.name;

            const normalizedFileName = fileNameNoExtension.toLowerCase().trim();
            // console.log(normalizedFileName, normalizedSearchNames);
            if (normalizedSearchNames.includes(normalizedFileName)) {
                resp[fileNameNoExtension] = file;
            }
        }
    }
    // console.log('resp: ', resp);
    return resp;
}

/**
 * Convertit une chaîne "95,5%" ou " 95.5 % " en nombre 95.5
 */
export function parsePourcentage(text: string): number | null {
    const cleanedText = text.trim();

    if (!cleanedText.endsWith('%')) {
        console.error("Le format doit se terminer par '%'. Reçu :", text);
        return null;
    }

    const numericPart = cleanedText.slice(0, -1).trim();

    const normalizedNumber = parseNumber(numericPart);
    const result = Number(normalizedNumber);

    if (isNaN(result) || numericPart === "") {
        console.error("Valeur numérique invalide :", numericPart);
        return null;
    }

    return result;
}

/**
 * Remplace la virgule décimale par un point
 */
export function parseNumber(text: string): string {
    return text.replace(',', '.');
}

export function parseDateFr(date: string): DateTime {
    const dateParsed = DateTime.fromFormat(date, "dd/mm/yyyy");
    if (!dateParsed.isValid) throw new Error(`Date fr invalide, recu: ${date}`);
    return dateParsed;
}

// format yyyy-mm-dd hh:mm:ss to dd/mm/yyyy
export function parseDateReverse(text: string): string {
    try {
        const trimmed = text.trim();
        if (!trimmed) return "";

        // On sépare la partie date de l'éventuelle partie heure
        const [datePart, timePart] = trimmed.split(" ");

        // On sépare le jour, le mois et l'année
        const dateSegments = datePart.split("-");

        if (dateSegments.length !== 3) {
            // Si le format n'est pas yyy-mm-dd, on retourne la chaîne telle quelle ou une erreur
            return trimmed;
        }

        const [year, month, day] = dateSegments;

        const isoDate = `${day}-${month}-${year}`;



        return `${isoDate}`;
    } catch (error) {

        throw error;
    }
}
// format dd/mm/yyyy to yyyy/mm/dd hh:mm:ss
export function parseDate(text: string): string {
    try {
        const trimmed = text.trim();
        if (!trimmed) return "";

        // On sépare la partie date de l'éventuelle partie heure
        const [datePart, timePart] = trimmed.split(" ");

        // On sépare le jour, le mois et l'année
        const dateSegments = datePart.split("/");

        if (dateSegments.length !== 3) {
            // Si le format n'est pas DD/MM/YYYY, on retourne la chaîne telle quelle ou une erreur
            return trimmed;
        }

        const [day, month, year] = dateSegments;

        // On reconstruit dans l'ordre YYYY-MM-DD
        const isoDate = `${year}-${month}-${day}`;

        // On ajoute l'heure (soit celle d'origine, soit minuit)
        const finalTime = timePart || "00:00:00";

        return `${isoDate} ${finalTime}`;
    } catch (error) {

        throw error;
    }
}