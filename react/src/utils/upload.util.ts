function buildAbsoluteUrl(path: string): string {
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${window.location.origin}${cleanPath}`;
}
export interface ExtractedImage {
    name: string;
    url: string;
    blob: Blob;
}

import { fileTypeFromBuffer } from 'file-type';
import JSZip from 'jszip';
export async function extractImagesFromZip(zipFile: File): Promise<ExtractedImage[]> {
    const zip = new JSZip();
    const extractedImages: ExtractedImage[] = [];

    try {
        // Chargement du ZIP
        const content = await zip.loadAsync(zipFile);

        // Liste des promesses pour l'extraction asynchrone
        const promises: Promise<void>[] = [];

        zip.forEach((relativePath: string, zipEntry: JSZip.JSZipObject) => {
            // Filtre : on ignore les dossiers et on ne prend que les extensions d'images
            const isImage = /\.(jpe?g|png|gif|webp|svg)$/i.test(relativePath) &&  !relativePath.includes ("MAC") ;

            if (!zipEntry.dir && isImage) {
                const fileName = relativePath.split('/').pop() || relativePath;
                const promise = zipEntry.async('blob').then((blob: Blob) => {
                    extractedImages.push({
                        name: fileName,
                        url: URL.createObjectURL(blob),
                        blob: blob // On garde le blob original au cas où tu voudrais l'uploader plus tard
                    });
                });
                promises.push(promise);
            }
        });

        await Promise.all(promises);
        return extractedImages;

    } catch (error) {
        console.error("Erreur TS lors de l'extraction :", error);
        throw new Error("Impossible de lire le fichier ZIP.");
    }
};
function guessMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const map: Record<string, string> = {
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        webp: 'image/webp',
        gif: 'image/gif',
        svg: 'image/svg+xml',
        pdf: 'application/pdf',
        txt: 'text/plain',
        json: 'application/json',
        html: 'text/html',
        css: 'text/css',
        js: 'application/javascript',
    };
    return map[ext ?? ''] ?? 'application/octet-stream';
}

export async function getFileFromUrl(imageUrl: string): Promise<File> {
    const absoluteUrl = imageUrl.startsWith('http')
        ? imageUrl
        : `${window.location.origin}/${imageUrl.replace(/^\/+/, '')}`;

    const response = await fetch(absoluteUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const buffer = await response.arrayBuffer();
    const type = await fileTypeFromBuffer(buffer);

    if (!type || !type.mime.startsWith('image/')) {
        throw new Error(`Pas une image valide: ${absoluteUrl}`);
    }

    const filename = absoluteUrl.split('/').pop() || `image.${type.ext}`;
    return new File([buffer], filename, { type: type.mime });
}

export async function getFileFromUrlWithExtensions(baseUrl: string): Promise<File> {
    const extensions = ['png', 'jpg', 'jpeg', 'webp', 'gif'];
    const absoluteBase = buildAbsoluteUrl(baseUrl);

    for (const ext of extensions) {
        const imageUrl = `${absoluteBase}.${ext}`;
        try {
            const response = await fetch(imageUrl);
            if (!response.ok) continue;

            return await getFileFromUrl(imageUrl);
        } catch {
            continue;
        }
    }

    throw new Error(`Aucune image trouvée pour: ${absoluteBase}`);
}