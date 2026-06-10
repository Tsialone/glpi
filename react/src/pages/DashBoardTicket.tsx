import { useEffect, useState, type JSX } from "react";
import { ticketService } from "../services/ticket.service";
import { Table } from "../components/Table";

export default function DashBoardTicket() {
    const [totalTicketMap, setTotalTicketMap] = useState<Record<string, number>>();
    const [totalTicketByStatusMap, setTotalTickeByStatustMap] = useState<Record<string, number>>();

    const [totalGenerale, setTotalGenerale] = useState<number>(0);
    async function getTotalTicketByStatusMap() {
        const respTotalTicketByStatusMap = await ticketService.getDashBoardTotalTicketByStatus();
        console.log(respTotalTicketByStatusMap);
        setTotalTickeByStatustMap(respTotalTicketByStatusMap);
    }
    async function getTotalTotalTicketMap() {
        const respTotalTicketMap = await ticketService.getDashBoardTotalTicket();
        console.log(respTotalTicketMap);
        setTotalTicketMap(respTotalTicketMap);
        let total = 0;
        for (const item in respTotalTicketMap) {
            if (Object.hasOwn(respTotalTicketMap, item)) {
                total += respTotalTicketMap[item];
            }
        }
        setTotalGenerale(total);
    }

    useEffect(() => {
        getTotalTotalTicketMap();
        getTotalTicketByStatusMap();
    }, []);

    function drawTotalTicketByStatusMap() {
        let elements: JSX.Element[] = [];
        if (totalTicketByStatusMap) {
            return (
                <Table
                    columns={
                        [
                            { label: "Status" },
                            { label: "Total" },

                        ]
                    }
                    data={Object.entries(totalTicketByStatusMap)}
                    keyExtractor={(item) => item[0]}
                    pagination={true}
                    itemsPerPage={20}
                    emptyMessage="Aucun équipement ne correspond à vos critères de recherche."
                    renderRow={(item => (
                        <>
                            <td>
                                {item[0]}
                            </td>
                            <td>
                                {item[1]}
                            </td>
                        </>
                    ))}
                >
                </Table>
            )
        }
        return elements;
    }
    function drawTotalTicketMap() {
        let elements: JSX.Element[] = [];
        for (const item in totalTicketMap) {
            if (!Object.hasOwn(totalTicketMap, item)) continue;
            const total = totalTicketMap[item];
            elements.push(
                <div className="col-6 col-sm-4 col-md-3 col-lg-2 mb-3" key={item}>
                    <div className="card text-white bg-dark border-secondary h-100 shadow-sm">
                        <div className="card-body text-center p-3 d-flex flex-column justify-content-center">
                            <h6 className="card-title text-uppercase text-light mb-2" style={{ fontSize: '0.85rem' }}>{item}</h6>
                            <h3 className="card-text fw-bold mb-0 text-info">{total}</h3>
                        </div>
                    </div>
                </div>
            )
        }
        return elements;
    }

    return (
        <>
            <div className="container p-4 bg-dark">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="text-white mb-0">Vue d'ensemble du Parc</h4>
                    <div className="badge bg-primary px-3 py-2 fs-5 shadow-sm">
                        Total Général : {totalGenerale}
                    </div>
                </div>
                <div className="row">
                    {drawTotalTicketMap()}
                </div>
                <div className="row col-6 mt-4">
                    <div className="col-md-8 col-lg-12"> {/* Prend 50% de l'écran sur PC */}
                        <h5 className="text-white mb-1" >Par status</h5>
                        {drawTotalTicketByStatusMap()}
                    </div>
                </div>
            </div>
        </>

    )
}