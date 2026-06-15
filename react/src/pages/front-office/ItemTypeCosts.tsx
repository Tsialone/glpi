import { useContext, useEffect, useState } from "react";
import { assetsService, type Super } from "../../services/assets.service";
import { Table } from "../../components/Table";
import { LoadingContext } from "../../contexts/Loading";
import { PopupContext } from "../../contexts/PopupContext";
import { specialCostService } from "../../services/nest/special-cost.service";

export default function () {

    const [supers, setSupers] = useState<Super[]>([]);
    const { setLoading } = useContext(LoadingContext)!;
    const {showPopup} = useContext (PopupContext)!;

   


    async function fetchRecap() {
        try {
            setLoading(true);
            await specialCostService.initGlpiCost ();
            const supers = await assetsService.getTable();
            // console.log(supers);
            setSupers(supers);
        } catch (error) {
            showPopup ((error as Error).message);
        }
        finally {
            setLoading(false);
        }

    }
    useEffect(() => {
        fetchRecap();
    }, []);
    return (
        <div className="row bg-dark">
            <div className="mb-4">

                <h3 className="text">Recap ItemType Cost</h3>
                <Table
                    columns={[
                        { label: "ItemType" },
                        { label: "Cost" },
                        { label: "SuperCost" },
                        { label: "OpenCost" },
                        { label: "Total" },
                    ]}
                    data={supers}
                    keyExtractor={(item) => item.itemType}
                    renderRow={(item => (
                        <>
                            <td style={{cursor: "pointer"}} className="fw-bold">
                                {item.itemType}
                            </td>
                            <td>
                                {item.glpiCost.toFixed(2)}
                            </td>
                            <td>
                                {item.superCost.toFixed(2)}
                            </td>
                            <td>
                                {item.openCost.toFixed(2)}
                            </td>
                            <td>
                                {item.total.toFixed(2)}
                            </td>
                        </>
                    ))}
                >


                </Table>
            </div>

            {/* {
                                supers.map(s => (
                                    <p className="text" >{s.itemType}  | {s.totalCost.toFixed(2)}  | {s.superCost.toFixed(2)} | {s.total.toFixed(2)} </p>
                                ))
                            } */}

        </div>
    );
}