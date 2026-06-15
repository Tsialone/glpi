import { useContext, useEffect, useState } from "react";
import type { INStatusColor } from "../types/nest/status-color";
import { statusColorService } from "../services/nest/status-color.service";
import { Table } from "../components/Table";
import { TICKET_STATUS } from "../utils";
import { LoadingContext } from "../contexts/Loading";

export default function StatusColor() {
    const [statusColors, setStatusColors] = useState<INStatusColor[]>([]);
    const [lastStatusColors, setLastStatusColors] = useState<INStatusColor[]>([]);
    const { setLoading } = useContext(LoadingContext)!;
    const columns = [
        { label: "Id" },
        { label: "Id_Status" },
        { label: "Status" },
        { label: "color" },
    ]
    async function fetchStatusColors() {
        try {
            setLoading(true);

            const respStatusColors = await statusColorService.getAll();

            // console.log(respStatusColors);
            setLastStatusColors(structuredClone(respStatusColors));
            setStatusColors(structuredClone(respStatusColors));
        } catch (error) {

        }
        finally {
            setLoading(false);
        }

    }
    function findDiff(): INStatusColor[] {
        const diff: INStatusColor[] = [];
        for (const statusColor of statusColors) {
            for (const lastStatusColor of lastStatusColors) {
                if (statusColor.id_status === lastStatusColor.id_status) {
                    if (statusColor.color.toLowerCase() !== lastStatusColor.color.toLowerCase()) {
                        diff.push(statusColor);
                    }
                }
            }
        }
        console.log("curr: ", statusColors);
        console.log("last: ", lastStatusColors);
        console.log("diff: ", diff);
        return diff;
    }
    useEffect(() => {
        fetchStatusColors();
    }, []);

    function handleStatusColorChanges(ev: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) {
        const { value, name } = ev.target;
        statusColors.forEach(s => {
            if (String(s.id_status) === name) {
                s.color = value;
            }
        })
        // console.log(statusColors)
        setStatusColors([...statusColors])
    }
    async function handleUpdate() {
        setLoading(true);
        try {
            const diffs = findDiff();
            for (const diff of diffs) {
                const tempStatusColor: Partial<INStatusColor> = {
                    id: diff.id,
                    color: diff.color
                }
                await statusColorService.modify(tempStatusColor);
                await fetchStatusColors();
            }
        } catch (error) {

        }
        finally {
            setLoading(false);
        }

    }
    return (
        <div>
            <Table
                columns={columns}
                data={statusColors}
                keyExtractor={(statusColor) => (statusColor.id)}
                emptyMessage="Pas de status colors"
                renderRow={(statusColor) => (
                    <>
                        <td className="col-2">
                            {statusColor.id}
                        </td>
                        <td className="col-2">
                            {statusColor.id_status}
                        </td>
                        <td className="col-2">
                            {(TICKET_STATUS as Record<number, string>)[statusColor.id_status] || "Inconnu"}
                        </td>
                        <td className="col-2">
                            <div className="col-6 d-flex" >
                                <input className="color me-2" name={String(statusColor.id_status)} type="color" value={statusColor.color} onChange={(ev) => handleStatusColorChanges(ev)} />
                                <p className="text text-light" >{statusColor.color}</p>
                            </div>

                        </td>
                    </>
                )}
            >
            </Table>
            {/* <div className="row" > */}

            <button className="btn btn-success mt-2" disabled={!(findDiff().length > 0)} onClick={handleUpdate} >Modifier</button>
            {/* </div> */}
        </div>
    )
}