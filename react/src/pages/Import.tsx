import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { LoadingContext } from "../contexts/Loading";
import { getFileByNameCsv } from "../utils/parse.util";
import type { LocalFile } from "papaparse";
import { FRONT_OFFICE, IMPORT_NAMES, UTIL_CONST } from "../utils";
import { extractImagesFromZip } from "../utils/upload.util";
import { useNavBarFront } from "../hooks/navbar-front.hook";
import { PopupContext } from "../contexts/PopupContext";
import { enIE } from "date-fns/locale";
import { resetService } from "../services/reset.service";
import { assetsImportService } from "../services/imports/assets-import.service";
import { ticketsImportService } from "../services/imports/tickets-import.service";
import { ticketCostService } from "../services/ticket-cost.service";
import { ticketsCostImportService } from "../services/imports/tickets-cost-import.service";

// --- Utilitaires IndexedDB pour stocker et restaurer les fichiers ---
const DB_NAME = "ImportFilesDB";
const STORE_NAME = "files";

const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => {
            request.result.createObjectStore(STORE_NAME);
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

const saveFileToDB = async (key: string, file: File | null) => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    if (file) {
        store.put(file, key);
    } else {
        store.delete(key);
    }
    return new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
};

const getFileFromDB = async (key: string): Promise<File | null> => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(key);
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve(request.result || null);
        tx.onerror = () => reject(tx.error);
    });
};

const clearAllFilesFromDB = async () => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).clear();
    return new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
};
// ------------------------------------------------------------------

export default function Import() {
    // Files states
    const [assetFile, setAssetFile] = useState<File | null>(null);
    const [ticketFile, setTicketFile] = useState<File | null>(null);
    const [ticketCostFile, setTicketCostFile] = useState<File | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const { showPopup } = useContext(PopupContext)!;
    const importImage = useRef(0);

    // Références pour pouvoir réinitialiser visuellement les inputs HTML
    const assetInputRef = useRef<HTMLInputElement>(null);
    const ticketInputRef = useRef<HTMLInputElement>(null);
    const ticketCostInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const [isChecked, setIsChecked] = useState<boolean>(false);

    const { setLoading } = useContext(LoadingContext)!;

    async function handleResetAuto() {
        console.log("reinitialisation....");
        setLoading(true);
        const tentative = 3;
        for (let index = 1; index <= tentative; index++) {
            try {
                const resetAll = await resetService.resetAll();
                // localStorage.removeItem(UTIL_CONST.user);
                // localStorage.removeItem(UTIL_CONST.token);
                break;
            } catch (error) {
                console.error("tentative de reset ", index);
                console.error(error);
            }
        }
        setLoading(false);
        await updateAssets();
    }

    const location = useLocation();
    async function updateAssets() {
        // const assets = await handleGetAll();
        // setAssets(assets);
    }

    // Effet pour restaurer les fichiers au chargement/rafraîchissement de la page
    useEffect(() => {
        const restoreFiles = async () => {
            try {
                const ast = await getFileFromDB("asset");
                const tkt = await getFileFromDB("ticket");
                const tc = await getFileFromDB("ticketCost");
                const img = await getFileFromDB("image");

                if (ast) setAssetFile(ast);
                if (tkt) setTicketFile(tkt);
                if (tc) setTicketCostFile(tc);
                if (img) setImageFile(img);
            } catch (e) {
                console.error("Erreur lors de la récupération des fichiers depuis IndexedDB", e);
            }
        };
        restoreFiles();
    }, []);

    // Handlers pour modifier les fichiers (Met à jour le state + IndexedDB)
    const handleFileChange = async (key: string, file: File | null, inputRef: React.RefObject<HTMLInputElement | null>) => {
        if (!file && inputRef.current) {
            inputRef.current.value = ""; // Reset visuel de l'input HTML
        }

        await saveFileToDB(key, file);

        if (key === "asset") setAssetFile(file);
        if (key === "ticket") setTicketFile(file);
        if (key === "ticketCost") setTicketCostFile(file);
        if (key === "image") setImageFile(file);
    };

    // Fonction pour tout effacer d'un coup
    const handleClearAllMemory = async () => {
        await clearAllFilesFromDB();
        setAssetFile(null);
        setTicketFile(null);
        setTicketCostFile(null);
        setImageFile(null);

        if (assetInputRef.current) assetInputRef.current.value = "";
        if (ticketInputRef.current) ticketInputRef.current.value = "";
        if (ticketCostInputRef.current) ticketCostInputRef.current.value = "";
        if (imageInputRef.current) imageInputRef.current.value = "";
        console.log("Mémoire des fichiers vidée.");
    };

    async function handleImport() {
        try {
            console.log("importé")
            setLoading(true);
            let extracted = null;
            if (imageFile) {
                console.log("Extracting images...");
                extracted = await extractImagesFromZip(imageFile);
                console.log(extracted);
            }

            if (assetFile) {
                console.log("Parsing assets...");
                const assetImport = await assetsImportService.getByCsv(assetFile);
                await assetsImportService.doImport(assetImport, extracted ?? []);
                console.log(assetImport);
            }

            if (ticketFile) {
                console.log("Parsing tickets...");
                const tickeImport = await ticketsImportService.getByCsv(ticketFile);
                await ticketsImportService.doImport(tickeImport);
                console.log(tickeImport);
            }

            if (ticketCostFile) {
                console.log("Parsing ticket costs...");
                const tickeCostImport = await ticketsCostImportService.getByCsv(ticketCostFile);
                await ticketsCostImportService.doImport(tickeCostImport);
                console.log(tickeCostImport);
            }

            await updateAssets();
        } catch (error) {
            console.error("Échec de l'import : tout s'arrête: ", (error as Error).message);
            try {
                await updateAssets();
            } catch (cleanupError) {
                console.error("Échec du nettoyage après erreur:", cleanupError);
            }
            showPopup((error as Error).message);
            console.error(error);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        updateAssets();
    }, [location.state, isChecked]);

    async function doPost() {
        console.log("im posting");
        await updateAssets();
    }

    return (
        <div className="container mt-4 mb-5 text-light" data-bs-theme="dark">

            {/* Header / Actions de réinitialisation */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Gestion des Imports</h2>
                <div className="d-flex gap-2">
                    <button className="btn btn-warning text-dark fw-bold" onClick={() => handleResetAuto()}>
                        Auto reset
                    </button>
                    <button className="btn btn-outline-danger" onClick={handleClearAllMemory}>
                        Effacer la mémoire (fichiers)
                    </button>
                </div>
            </div>

            {/* Section Formulaire d'import */}
            <div className="card shadow-sm mb-4 bg-dark border-secondary">
                <div className="card-header bg-transparent border-secondary">
                    <h5 className="mb-0 text-light">Fichiers d'importation</h5>
                </div>
                <div className="card-body">
                    <div className="row g-3">

                        {/* INPUT ASSETS */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold text-light">Assets (CSV)</label>
                            <input
                                type="file"
                                className="form-control bg-dark text-light border-secondary"
                                ref={assetInputRef}
                                onChange={(e) => handleFileChange("asset", e.target.files?.[0] || null, assetInputRef)}
                            />
                            {assetFile && (
                                <div className="mt-2 d-flex align-items-center justify-content-between text-info">
                                    <small>💾 Chargé : <strong className="text-light">{assetFile.name}</strong></small>
                                    <button type="button" className="btn btn-sm btn-outline-light" onClick={() => handleFileChange("asset", null, assetInputRef)}>Détacher</button>
                                </div>
                            )}
                        </div>

                        {/* INPUT TICKETS */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold text-light">Tickets (CSV)</label>
                            <input
                                type="file"
                                className="form-control bg-dark text-light border-secondary"
                                ref={ticketInputRef}
                                onChange={(e) => handleFileChange("ticket", e.target.files?.[0] || null, ticketInputRef)}
                            />
                            {ticketFile && (
                                <div className="mt-2 d-flex align-items-center justify-content-between text-info">
                                    <small>💾 Chargé : <strong className="text-light">{ticketFile.name}</strong></small>
                                    <button type="button" className="btn btn-sm btn-outline-light" onClick={() => handleFileChange("ticket", null, ticketInputRef)}>Détacher</button>
                                </div>
                            )}
                        </div>

                        {/* INPUT TICKET COSTS */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold text-light">Ticket Costs (CSV)</label>
                            <input
                                type="file"
                                className="form-control bg-dark text-light border-secondary"
                                ref={ticketCostInputRef}
                                onChange={(e) => handleFileChange("ticketCost", e.target.files?.[0] || null, ticketCostInputRef)}
                            />
                            {ticketCostFile && (
                                <div className="mt-2 d-flex align-items-center justify-content-between text-info">
                                    <small>💾 Chargé : <strong className="text-light">{ticketCostFile.name}</strong></small>
                                    <button type="button" className="btn btn-sm btn-outline-light" onClick={() => handleFileChange("ticketCost", null, ticketCostInputRef)}>Détacher</button>
                                </div>
                            )}
                        </div>

                        {/* INPUT IMAGES */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold text-light">Images (ZIP)</label>
                            <input
                                type="file"
                                className="form-control bg-dark text-light border-secondary"
                                ref={imageInputRef}
                                onChange={(e) => handleFileChange("image", e.target.files?.[0] || null, imageInputRef)}
                            />
                            {imageFile && (
                                <div className="mt-2 d-flex align-items-center justify-content-between text-info">
                                    <small>💾 Chargé : <strong className="text-light">{imageFile.name}</strong></small>
                                    <button type="button" className="btn btn-sm btn-outline-light" onClick={() => handleFileChange("image", null, imageInputRef)}>Détacher</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <hr className="my-4 border-secondary" />

                    {/* OPTION ET BOUTONS */}
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input bg-dark border-secondary"
                                id="ignoreImagesCheck"
                                checked={isChecked}
                                onChange={() => setIsChecked(!isChecked)}
                            />
                            <label className="form-check-label user-select-none text-light" htmlFor="ignoreImagesCheck">
                                Ne pas importer les images
                            </label>
                        </div>

                        <div className="d-flex gap-2">
                            <button className="btn btn-secondary px-4" onClick={() => doPost()}>
                                Post
                            </button>
                            <button className="btn btn-primary px-4" onClick={() => handleImport()}>
                                Importer
                            </button>
                        </div>
                    </div>
                </div>
            </div>



        </div>
    );
}