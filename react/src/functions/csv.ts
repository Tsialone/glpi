import Papa, { type LocalFile } from 'papaparse';

export function verifyExtenstion(extensions: string[], file: globalThis.File | null) {
    if (!file) throw new Error("File is null");
    const fileExtension = file.name.split(".").pop()?.toLocaleLowerCase();
    if (extensions.length == 0) throw new Error("Extensions must be chosen");
    for (const extension of extensions) {
        const ext = extension.toLocaleLowerCase();
        if (ext == fileExtension) return true;
    }
    throw new Error(`File exetensions must be in ${extensions} but ${file.type} given`);
}


export async function makeImport<T>(file: LocalFile, transformFunction: (value: string, column: string | number) => void, transformHeaderFunction: (header: string) => string, parseCsv?: (objects: T[]) => Promise<T[]>) {
    const parsing = new Promise<T[]>((resolve, reject) => {
        Papa.parse<T>(file,
            {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: true,
                delimiter: ",",
                transformHeader: (header) => {
                    try {
                        return transformHeaderFunction(header) || header;
                    } catch (error) {
                        reject(error);
                        return header;
                    }
                },
                transform: (value, column) => {
                    try {
                        return transformFunction(value, column);
                    } catch (error) {
                        reject(error);
                    }
                },
                complete: (results) => {
                    resolve(results.data);
                },
                error: (error) => {
                    console.error("erreur: ", error);
                    reject(error);
                }
            }
        );
    });
    if (!parseCsv) return parsing;
    const csv = await parsing;
    return parseCsv(csv);

}

// export async function makeImport<T>(file: LocalFile, transformFunction: (value: string, column: string | number) => void , transformHeaderFunction : (header:string) => string) {
//     return new Promise<T[]>((resolve, reject) => {
//         Papa.parse<T>(file,
//             {
//                 header: true,
//                 skipEmptyLines: true,
//                 dynamicTyping: true,
//                 transformHeader: (header) => {
//                     return transformHeaderFunction (header) || header;
//                 },
//                 transform: (value, column) => {
//                     return transformFunction(value, column);
//                 },
//                 complete: (results) => {
//                     resolve(results.data);
//                 },
//                 error: (error) => {
//                     console.error("erreur: ", error);
//                     reject(error);
//                 }
//             }
//         );
//     });
// }

