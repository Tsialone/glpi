import { useContext, useEffect, useState } from "react";
import type { INStatusColor } from "../types/nest/status-color";
import { statusColorService } from "../services/nest/status-color.service";
import { Table } from "../components/Table";
import { REVERSE_TICKET_STATUS, TICKET_STATUS } from "../utils";
import { LoadingContext } from "../contexts/Loading";
import type { INStatusLang } from "../types/nest/status-lang";
import { statusLangService } from "../services/nest/status-lang.service";
import { PopupContext } from "../contexts/PopupContext";

export default function StatusLang() {
    const [statusLangs, setStatusLangs] = useState<INStatusLang[]>([]);

    const [statusLangForm, setStatusLangForm] = useState<Partial<INStatusLang>>({});

    const [lastStatusLangs, setLastStatusLangs] = useState<INStatusLang[]>([]);
    const { setLoading } = useContext(LoadingContext)!;
    const { showPopup } = useContext(PopupContext)!;
    const columns = [
        { label: "Id" },
        { label: "Id_Status" },
        { label: "Lang" },
        { label: "Valeur" },
    ]
    async function fetchStatusLangs() {
        try {
            setLoading(true);

            const respStatusLangs = await statusLangService.getAll();
            console.log(respStatusLangs);
            // console.log(respStatusLangs);
            setStatusLangs(structuredClone(respStatusLangs));
            setLastStatusLangs(structuredClone(respStatusLangs));
        } catch (error) {

        }
        finally {
            setLoading(false);
        }

    }
    function findDiff(): INStatusLang[] {
        const diff: INStatusLang[] = [];
        for (const statusLang of statusLangs) {
            for (const lastStatusLang of lastStatusLangs) {
                if (statusLang.id_status === lastStatusLang.id_status && statusLang.lang === lastStatusLang.lang) {
                    if (statusLang.value !== lastStatusLang.value) {
                        diff.push(statusLang);
                    }
                }
            }
        }
        console.log("curr: ", statusLangs);
        console.log("last: ", lastStatusLangs);
        console.log("diff: ", diff);
        return diff;
    }
    useEffect(() => {
        fetchStatusLangs();
    }, []);

    function handleStatusLangChanges(ev: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) {
        const { value, name } = ev.target;

        statusLangs.forEach(s => {
            const key = `${s.id_status}_${s.lang}`;
            const isSame = key === name;
            if (isSame) {
                s.value = value;
            }
        })
        // console.log(statusColors)
        setStatusLangs([...statusLangs])
    }
    async function handleUpdate() {
        setLoading(true);
        try {
            const diffs = findDiff();
            for (const diff of diffs) {
                const tempStatusLang: Partial<INStatusLang> = {
                    id: diff.id,
                    value: diff.value,
                    id_status: diff.id_status,
                }
                await statusLangService.modify(tempStatusLang);
                await fetchStatusLangs();
            }
        } catch (error) {
            showPopup((error as Error).message ?? " erreur pendant l'ajout")
        }
        finally {
            setLoading(false);
        }

    }
    async function handleAddStatusLang() {
        try {
            if (statusLangForm) {
                if (!statusLangForm.id_status || !statusLangForm.lang || !statusLangForm.value) {
                    throw new Error("Valeur manquante");
                }
                console.log(statusLangForm);
                await statusLangService.create(statusLangForm);
                await fetchStatusLangs();
            }
        } catch (error) {
            showPopup((error as Error).message ?? " erreur pendant l'ajout")
        }

    }
    return (
        <div>
            <div className="row d-flex align-items-center">
                <div className="mb-3 col-2">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select name="" id="status" className="form-control" onChange={(ev) => setStatusLangForm({ ...statusLangForm, id_status: Number(ev.target.value) })}>
                        <option value="">---status----</option>
                        {
                            Object.entries(TICKET_STATUS).map(
                                ([key, value]) => {
                                    if ([1, 2, 6].includes(Number(key))) {
                                        return (
                                            <option key={key} value={key}>{value}</option>
                                        )
                                    }

                                }
                            )
                        }
                    </select>
                </div>
                <div className="mb-3 col-2">
                    <label htmlFor="lang" className="form-label">Lang</label>
                    <input type="text" id="lang" className="form-control" placeholder="Ex: mg" onChange={(ev) => setStatusLangForm({ ...statusLangForm, lang: ev.target.value })} />
                </div>
                <div className="mb-3 col-2">
                    <label htmlFor="valeur" className="form-label">Valeur</label>
                    <input type="text" id="valeur" className="form-control" placeholder="Ex: tsara" onChange={(ev) => setStatusLangForm({ ...statusLangForm, value: ev.target.value })} />
                </div>
                <div className="mb-3 col-2">
                    <label htmlFor="action" className="form-label">Action</label>
                    <button className="btn btn-success w-100 form-control" id="action" onClick={handleAddStatusLang} >Ajouter</button>
                </div>
            </div>
            <div className="row" >
                <Table
                    columns={columns}
                    data={statusLangs}
                    keyExtractor={(statusLang) => (statusLang.id)}
                    emptyMessage="Pas de status langs"
                    renderRow={(statusLang) => (
                        <>
                            <td className="col-2">
                                {statusLang.id}
                            </td>
                            <td className="col-2">
                                {(TICKET_STATUS as Record<number, string>)[statusLang.id_status] || "Inconnu"}
                            </td>
                            <td className="col-2">
                                {statusLang.lang}
                            </td>
                            <td className="col-3">
                                <div className="col-6 d-flex" >
                                    <input className="color me-2 form-control" name={String(`${statusLang.id_status}_${statusLang.lang}`)} type="text" value={statusLang.value} onChange={(ev) => handleStatusLangChanges(ev)} />
                                </div>

                            </td>
                        </>
                    )}
                >
                </Table>
            </div>

            {/* <div className="row" > */}

            <button className="btn btn-success mt-2" disabled={!(findDiff().length > 0)} onClick={handleUpdate} >Modifier</button>
            {/* </div> */}
        </div>
    )
}