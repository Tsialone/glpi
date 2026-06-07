import { useContext, useEffect, useState } from "react";
import type { IAsset, IAssetFiche, IAssetFicheFilter } from "../../types/assets";
import { assetsService } from "../../services/assets.service";
import { Table } from "../../components/Table";
import { ITEM_TYPE } from "../../utils";
import { LoadingContext } from "../../contexts/Loading";

export default function Item() {
    const [assets, setAssets] = useState<IAssetFiche[]>([]);
    const [assetFicheFilter, setAssetFicheFilter] = useState<Partial<IAssetFicheFilter>>({})
    const { setLoading } = useContext(LoadingContext)!;
    const itemColumns = [
        { key: "name", label: "Nom" },
        { key: "status", label: "Statut" },
        { key: "user", label: "Utilisateur" },
        { key: "manufacturer", label: "Fabricant" },
        { key: "location", label: "Localisation" },
        { key: "type", label: "Type" },
        { key: "model", label: "Modèle" },
    ];
    async function getAssets(filter?: Partial<IAssetFicheFilter>) {
        try {
            setLoading(true);
            const respAssets = await assetsService.getAllFiche(filter);
            setAssets(respAssets);
        } catch (error) {
        }
        finally {
            setLoading(false);
        }


    }
    useEffect(() => {
            getAssets();
    }, []);
    async function handleFilter() {
        try {
            setLoading(true);
            await getAssets(assetFicheFilter);

        } catch (error) {

        }
        finally {
            setLoading(false);
        }
        // console.log ("hey");
    }
    async function handleResetFilter() {
        try {
            setLoading(true);
            await getAssets({});
        } catch (error) {

        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="container-fluid p-4 min-vh-100 bg-dark text-white">
            <h2 className="mb-4">Gestion des Équipements</h2>

            {/* Formulaire de Filtre */}
            <div className="card bg-dark text-white border-secondary mb-4 shadow-sm" data-bs-theme="dark">
                <div className="card-header border-secondary py-3">
                    <h5 className="mb-0 text-info">Filtres de recherche</h5>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label text small fw-bold">UTILISATEUR</label>
                            <input
                                type="text"
                                className="form-control bg-dark text-white border-secondary"
                                placeholder="Chercher un utilisateur..."
                                onChange={(e) => setAssetFicheFilter({ ...assetFicheFilter, user_name: e.target.value })}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label text small fw-bold">NOM DE L'ÉQUIPEMENT</label>
                            <input
                                type="text"
                                className="form-control bg-dark text-white border-secondary"
                                placeholder="Nom de l'item..."
                                onChange={(e) => setAssetFicheFilter({ ...assetFicheFilter, name: e.target.value })}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label text small fw-bold">TYPE D'ÉQUIPEMENT</label>
                            <select
                                className="form-select bg-dark text-white border-secondary"
                                onChange={(e) => setAssetFicheFilter({ ...assetFicheFilter, item_type: e.target.value })}
                            >
                                <option value="">-- Tous les types --</option>
                                {ITEM_TYPE.map((i, index) => (
                                    <option key={index} value={i}>{i}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top border-secondary">
                        <button className="btn btn-outline-light px-4" onClick={handleResetFilter}>
                            Réinitialiser
                        </button>
                        <button className="btn btn-primary px-4 shadow-sm" onClick={handleFilter}>
                            Filtrer les résultats
                        </button>
                    </div>
                </div>
            </div>

            {/* Tableau des Équipements généré via le composant <Table> */}
            <Table
                columns={itemColumns}
                data={assets}
                keyExtractor={(_, index) => index}
                pagination={true}
                itemsPerPage={20}
                emptyMessage="Aucun équipement ne correspond à vos critères de recherche."
                renderRow={a => (
                    <>
                        <td className="fw-medium">{a.name}</td>
                        <td>
                            {a.item_state?.name ? (
                                <span className="badge bg-secondary rounded-pill">{a.item_state.name}</span>
                            ) : (
                                <span className="text-muted">-</span>
                            )}
                        </td>
                        <td>{a.user?.name || <span className="text-muted">-</span>}</td>
                        <td>{a.manufacturer?.name || <span className="text-muted">-</span>}</td>
                        <td>{a.location?.name || <span className="text-muted">-</span>}</td>
                        <td>
                            <span className="badge border border-info text-info">{a.item_type}</span>
                        </td>
                        <td>{a.item_model?.name || <span className="text-muted">-</span>}</td>
                    </>
                )}
            />
        </div>
    );
}