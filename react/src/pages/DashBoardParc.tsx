import { useEffect, useState, type JSX } from "react";
import { assetsService } from "../services/assets.service";

export default function DashBoardParc() {
    const [totalItemMap, setTotalItemMap] = useState<Record<string, number>>();
    const [totalGenerale, setTotalGenerale] = useState<number>(0);

    async function getTotalTotalItemMap() {
        const respTotalItemMap = await assetsService.getDashBoardTotalParc();
        setTotalItemMap(respTotalItemMap);
        
        let total = 0;
        for (const item in respTotalItemMap) {
            if (Object.hasOwn(respTotalItemMap, item)) {
                total += respTotalItemMap[item];
            }
        }
        setTotalGenerale(total);
    }

    useEffect(() => {
        getTotalTotalItemMap();
    }, []);

    function drawTotalItemMap() {
        let elements: JSX.Element[] = [];
        for (const item in totalItemMap) {
            if (!Object.hasOwn(totalItemMap, item)) continue;
            const total = totalItemMap[item];
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
        <div className="container-fluid p-4 min-vh-100 bg-dark">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="text-white mb-0">Vue d'ensemble du Parc</h4>
                <div className="badge bg-primary px-3 py-2 fs-5 shadow-sm">
                    Total Général : {totalGenerale}
                </div>
            </div>
            <div className="row">
                {drawTotalItemMap()}
            </div>
        </div>
    )
}