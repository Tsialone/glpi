import { Outlet } from "react-router-dom";
import NavBarFront from "../../components/NavbarFront";
import { NavBarFrontProvider } from "../../contexts/NavBarFrontContext";

export default function LayoutFront() {
    return (
        <div style={{ backgroundColor: '#333334', minHeight: '100vh', color: 'white' }}>
            {/* Barre de navigation fixe en haut */}
            <NavBarFrontProvider>
                {<NavBarFront  ></NavBarFront>}
            {/* Contenu dynamique (tes pages) */}
            <main className="container py-4">
                <Outlet />
            </main>
            </NavBarFrontProvider>
            {/* Footer simple (Optionnel) */}
            <footer className="py-4 mt-auto border-top border-secondary text-center text-secondary">
                <small>&copy; 2026 Mon Shop - Style Dark Bootstrap</small>
            </footer>
        </div>
    );
}