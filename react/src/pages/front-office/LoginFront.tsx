import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { verifyPassword } from "../../utils/parse.util";
import type { LoginForm } from "../../types/auth/login";
interface LoginFrontProps {
    initProps : () => void
}
export function LoginFront() {
    const [loginForm, setLoginForm] = useState<LoginForm>({ username: "pub@prestashop.com", password: "bloodseeker1902" });
    // const [customers, setCustomers] = useState<ICustomer[]>([]);
    const navigate = useNavigate();

    // useEffect(() => {
    //     async function loadCustomers() {
    //         const data = await getCustomers();
    //         setCustomers(data);
    //     }
    //     loadCustomers();
    // }, []);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setLoginForm({ ...loginForm, [name]: value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); 
        // const { email, mdp } = loginForm;
        // const customer = customers.find(c => c.email === email);
        
        // if (customer) {
        //     const temp = await verifyPassword(mdp, customer.passwd);
        //     if (temp) loginSuccess(customer);
        // }
    }

    // function loginSuccess(customer: ICustomer) {
    //     localStorage.setItem(FRONT_OFFICE.user, JSON.stringify(customer));
    //     props.initProps ();
    //     navigate("/frontoffice/home");
    // }

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 py-5" style={{ backgroundColor: '#333334' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div className="row g-4">
                    
                    {/* GAUCHE : Formulaire classique */}
                    <div className="col-md-6">
                        <div className="card shadow-lg border-secondary h-100" style={{ backgroundColor: '#2a2a2b' }}>
                            <div className="card-body p-5 d-flex flex-column justify-content-center">
                                <div className="text-center mb-4">
                                    <h2 className="text-white fw-bold text-uppercase">Connexion</h2>
                                    <p className="text-secondary small">Front Office Access</p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label text-secondary small">Adresse Email</label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            className="form-control bg-dark text-white border-secondary p-3" 
                                            value={loginForm.password} 
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label text-secondary small">Mot de passe</label>
                                        <input 
                                            type="password" 
                                            name="mdp" 
                                            className="form-control bg-dark text-white border-secondary p-3" 
                                            value={loginForm.username} 
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100 py-3 fw-bold text-uppercase shadow">
                                        Se connecter
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* DROITE : Liste utilisateurs */}
                    {/* <div className="col-md-6">
                        <div className="card shadow-lg border-secondary h-100" style={{ backgroundColor: '#2a2a2b' }}>
                            <div className="card-body p-5 d-flex flex-column">
                                <div className="text-center mb-4">
                                    <h2 className="text-white fw-bold text-uppercase">Utilisateurs</h2>
                                    <p className="text-secondary small">Connexion rapide en un clic</p>
                                </div>
                                <div className="overflow-auto pr-2" style={{ maxHeight: '350px' }}>
                                    <div className="list-group list-group-flush">
                                        {customers.map((customer) => (
                                            <div key={customer.id} className="list-group-item bg-dark border-secondary d-flex justify-content-between align-items-center rounded mb-2 p-3">
                                                <div className="text-truncate me-2">
                                                    <h6 className="text-white mb-0 text-truncate">{customer.firstname} {customer.lastname}</h6>
                                                    <small className="text-secondary text-truncate d-block">{customer.email}</small>
                                                </div>
                                                <button 
                                                    onClick={() => loginSuccess(customer)}
                                                    className="btn btn-outline-primary btn-sm fw-bold px-3 py-2 text-uppercase text-nowrap"
                                                    style={{ fontSize: '0.75rem' }}
                                                >
                                                    Se connecter
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}

                </div>
            </div>
        </div>
    );
}