import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";

export default function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
   
    return (
        <div className="d-flex">
            <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            
            <div 
                className="flex-grow-1 p-4" 
                style={{ 
                    marginLeft: isSidebarOpen ? '280px' : '0', 
                    transition: 'margin-left 0.3s ease' 
                }}
            >
                {!isSidebarOpen && (
                    <button 
                        className="btn btn-dark mb-3" 
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        ☰ Afficher le menu
                    </button>
                )}

                <div>
                    <h2>DashBoard</h2>
                    <hr />
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    );
}
