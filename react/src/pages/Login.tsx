import React, { useContext, useEffect, useState } from "react";
import { verifyPassword } from "../utils/parse.util";
import { useNavigate } from "react-router-dom";
import { BACK_OFFICE } from "../utils";
import { PopupContext } from "../contexts/PopupContext";
import type { LoginForm } from "../types/auth/login";
import { userService } from "../services/user.service";

export default function Login() {
    const [loginForm, setLoginForm] = useState<LoginForm>({ username: "glpi", password: "glpi" })
    const navigate = useNavigate();
    const { showPopup } = useContext(PopupContext)!;
    useEffect(() => {
        // const fetch = async () => {
        //     const employees = await getAllEmployees();
        //     // console.log(employees);
        // }
        // fetch();
    }, []);
    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        const form: LoginForm = {
            ...loginForm,
            [name]: value
        }
        setLoginForm(form);

    }
    async function handleSubmit(e: React.MouseEvent<HTMLElement>) {
        try {
            const { username, password } = loginForm;
            console.log(username, password);
            const user = await userService.login(username, password);
            if (user){
                navigate ("/backoffice/admin/imports")
            }
        } catch (error : Error | any) {
            console.error (error);
            showPopup (error);
        }

        // console.log (users);
        // const employees = await getAllEmployees();
        // const employee = employees.filter(e => { return e.email == email })[0] ?? null;
        // if (employee) {
        //     const temp = await verifyPassword(mdp, employee.passwd);
        //     if (temp == true) {
        //         localStorage.setItem(BACK_OFFICE.user, JSON.stringify(employee));
        //         navigate("/admin/backoffice/orders");
        //     } else {
        //         showPopup("Mot de passe incorrect");

        //     }
        // } else {
        //     showPopup("Employee non trouvé");
        // }

    }
    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 py-5" style={{ backgroundColor: '#333334' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div className="row g-4 justify-content-center">

                    {/* GAUCHE : Formulaire classique */}
                    <div className="col-md-6">
                        <div className="card shadow-lg border-secondary h-100" style={{ backgroundColor: '#2a2a2b' }}>
                            <div className="card-body p-5 d-flex flex-column justify-content-center">
                                <div className="text-center mb-4">
                                    <h2 className="text-white fw-bold text-uppercase">Connexion</h2>
                                    <p className="text-secondary small">Back Office Access</p>
                                </div>

                                <div>
                                    <div className="mb-3">
                                        <label className="form-label text-secondary small">Adresse Email</label>
                                        <input
                                            type="text"
                                            name="username"
                                            className="form-control bg-dark text-white border-secondary p-3"
                                            value={loginForm.username}
                                            onChange={(e) => { handleInputChange(e) }}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label text-secondary small">Mot de passe</label>
                                        <input
                                            type="password"
                                            name="password"
                                            className="form-control bg-dark text-white border-secondary p-3"
                                            value={loginForm.password}
                                            onChange={(e) => { handleInputChange(e) }}
                                        />
                                    </div>

                                    <button
                                        className="btn btn-primary w-100 py-3 fw-bold text-uppercase shadow"
                                        onClick={(e) => handleSubmit(e)}
                                    >
                                        Se connecter
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}