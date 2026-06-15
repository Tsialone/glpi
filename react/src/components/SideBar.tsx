import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../services/user.service';

interface SideBarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function SideBar({ isOpen = true, onClose }: SideBarProps) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleLogOut = async () => {
        await userService.logout();
        navigate("/backoffice");
    };

    return (
        <aside
            className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark vh-100"
            style={{ width: '280px', position: 'fixed', top: 0, left: 0, zIndex: 1050 }}
        >
            <div className="d-flex align-items-center justify-content-between mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span className="fs-4 fw-semibold">Navigation</span>
                {onClose && (
                    <button
                        type="button"
                        className="btn-close btn-close-white"
                        aria-label="Close"
                        onClick={onClose}
                    ></button>
                )}
            </div>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item mb-1">
                    <Link to="/frontoffice" className="nav-link text-white">
                        <i className="bi bi-download me-2"></i>
                        Frontoffice
                    </Link>
                </li>
                <li className="nav-item mb-1">
                    <Link to="/backoffice/admin/imports" className="nav-link text-white">
                        <i className="bi bi-download me-2"></i>
                        Import
                    </Link>
                </li>
                <li className="nav-item mb-1">
                    <Link to="/backoffice/admin/dashboard-parc" className="nav-link text-white">
                        <i className="bi bi-download me-2"></i>
                        Dashboard Parc
                    </Link>
                </li>
                <li className="nav-item mb-1">
                    <Link to="/backoffice/admin/dashboard-ticket" className="nav-link text-white">
                        <i className="bi bi-download me-2"></i>
                        Dashboard Ticket
                    </Link>
                </li>
                <li className="nav-item mb-1">
                    <Link to="/backoffice/admin/status-color" className="nav-link text-white">
                        <i className="bi bi-download me-2"></i>
                        Status color
                    </Link>
                </li>
                  <li className="nav-item mb-1">
                    <Link to="/backoffice/admin/status-lang" className="nav-link text-white">
                        <i className="bi bi-download me-2"></i>
                        Status lang
                    </Link>
                </li>
                <li className="nav-item mb-1">
                    <Link to="/backoffice/admin/ticket" className="nav-link text-white">
                        <i className="bi bi-download me-2"></i>
                        Tickets
                    </Link>
                </li>
            </ul>
            <div className="mt-auto">
                <button
                    className="btn btn-danger w-100 mb-3"
                    onClick={handleLogOut}
                >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                </button>
                <div className="text-muted small text-center">
                    © 2023 Mon Application
                </div>
            </div>
        </aside>
    );
}
