import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
// import type { ICreateCart } from "../types/carts/Cart";
// import { useNavBarFront } from "../hooks/navbar-front.hook";
import { NavBarFrontContext } from "../contexts/NavBarFrontContext";

export default function NavBarFront() {
    const location = useLocation();
    const navigate = useNavigate(); // Pour rediriger après déco
    const { productCount } = useContext(NavBarFrontContext)!;

    useEffect(() => {
        // const storage = localStorage.getItem(FRONT_OFFICE.user);
        // if (!storage) return;
        // const customerJson = JSON.parse(storage) as ICustomer;
        // setCustomer(customerJson);
    }, []);


    const handleLogout = () => {
        // Ajoute ici ta logique de déconnexion (ex: localStorage.clear())
        // localStorage.removeItem(FRONT_OFFICE.user);
        // localStorage.removeItem(FRONT_OFFICE.cart);

        console.log("Déconnexion...");
        navigate("/"); // Exemple de redirection
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark shadow-sm sticky-top"
            style={{ backgroundColor: '#2a2a2b', borderBottom: '1px solid #444' }}>
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/frontoffice/home">
                    <span className="text-primary text-uppercase">Gl</span>pi
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center gap-2 gap-lg-3">


                        {/* Bouton Mes Commandes */}
                        <li className="nav-item">
                            <Link
                                to="/frontoffice/item"
                                className={`btn btn-sm px-3 rounded-pill transition-all btn-outline-secondary`}
                            >
                                <i className="bi bi-bag me-1"></i> Elements
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="/backoffice/admin"
                                className={`btn btn-sm px-3 rounded-pill transition-all btn-outline-secondary`}
                            >
                                <i className="bi bi-bag me-1"></i> Backoffice
                            </Link>
                        </li>
                        {/* Bouton Mon Panier */}
                        <li className="nav-item">
                            <Link
                                to="/frontoffice/ticket-saisie"
                                className="btn btn-sm px-3 rounded-pill transition-all btn-outline-secondary"
                            >
                                <i className="bi bi-cart3 me-1"></i>Nouveau ticket
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="/frontoffice/ticket-status"
                                className="btn btn-sm px-3 rounded-pill transition-all btn-outline-secondary"
                            >
                                <i className="bi bi-cart3 me-1"></i>Status ticket
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="/frontoffice/itemType-cost"
                                className="btn btn-sm px-3 rounded-pill transition-all btn-outline-secondary"
                            >
                                <i className="bi bi-cart3 me-1"></i>Item Type Cost
                            </Link>
                        </li>

                        {/* Nom de l'utilisateur connecté */}
                        {/* {customer?.lastname && (
                            <li className="nav-item border-start ps-lg-3 d-none d-lg-block">
                                <span className="navbar-text small text-secondary fw-semibold">
                                    <i className="bi bi-person-circle me-1"></i> {customer.lastname}
                                </span>
                            </li>
                        )} */}

                        {/* Bouton Déconnexion Réparé */}
                        <li className="nav-item">
                            <button
                                onClick={handleLogout}
                                className="btn btn-sm btn-outline-danger px-3 rounded-pill d-flex align-items-center gap-2"
                            >
                                {/* Icône de secours en SVG si Bootstrap Icons n'est pas chargé */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                                    <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                                </svg>
                                <span>Déconnexion</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}