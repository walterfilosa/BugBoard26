import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './Login.css'
import {Eye, EyeOff, AlertCircle, Loader2} from 'lucide-react';
import { loginUser } from './services/api';
import { jwtDecode } from "jwt-decode";
import { useAuth } from '../context/AuthContext';

export default function Login() {

    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    /*const handleLogin = async (e) => { // Nota la keyword 'async'
        e.preventDefault();

        // 1. Validazione base
        if (!email.trim() || !password.trim()) {
            setError("Per favore, inserisci sia l'email che la password.");
            return;
        }

        setError("");
        setIsLoading(true); // Attiva lo spinner

        try {
            // 2. Chiamata al Back-End
            const data = await loginUser(email, password);

            // 3. Il server ti risponde. Di solito l'oggetto ha un campo 'accessToken' o 'token'
            // Chiedi al collega come si chiama il campo. Ipotizziamo 'accessToken'.
            const token = data.accessToken;

            if (!token) throw new Error("Token non ricevuto dal server");

            // 4. Salva il token nel browser
            localStorage.setItem("token", token);

            // 5. Decodifica il token per leggere il ruolo
            const decoded = jwtDecode(token);

            // Ipotizziamo che nel token ci sia un campo "role" o "roles"
            // Esempio: decoded.role = "ADMIN" o "USER"
            const userRole = decoded.role || "user";

            // 6. Reindirizzamento in base al ruolo
            if (userRole === "admin" || userRole === "ADMIN") {
                console.log("Login come Admin");
                navigate('/admin/home'); // Assicurati che la rotta nel Router sia questa
            } else {
                console.log("Login come Utente");
                navigate('/home-utente'); // Assicurati che la rotta nel Router sia questa
            }

        } catch (err) {
            console.error("Errore Login:", err);
            setError("Email o password non corretti."); // Messaggio per l'utente
        } finally {
            setIsLoading(false); // Spegni lo spinner in ogni caso
        }
    }*/

    const handleLogin = (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            setError("Per favore, inserisci sia l'email che la password.");
            return;
        }

        setError("");
        console.log("Login tentato con:", email);

        let userRole = "user";

        if (email.toLowerCase().includes("admin")) {
            userRole = "admin";
        }

        localStorage.setItem("userRole", userRole);
        if (userRole === "admin") {
            console.log("Login come Admin");
            navigate('/progetti');
        } else {
            console.log("Login come Utente");
            navigate('/progetti');
        }
        //logica di login

    }

    return (
        <div className="login-page">
            <div className="login-card">
                <img src="/Logo/LogoBugBoard26.svg" alt={"Logo di BugBoard"} className="login-logo"/>
                <h2 className="login-title">Benvenuto</h2>
                <p className="login-subtitle">Inserisci le tue credenziali per accedere</p>

                {error && <div className="error-message">
                    <AlertCircle size={20} className={"error-icon"}/>
                    <span>{error}</span>
                </div>}

                <form onSubmit={handleLogin} className="login-form">
                    <div className="floating-label-group login-input-group">
                        <input autoFocus
                            type="email"
                            value={email}
                            onChange={(e) => {setEmail(e.target.value);
                            if(error) setError("")}}
                            className="campo"
                            placeholder=" "
                            required
                        />
                        <label className="floating-label">Email</label>
                    </div>

                    <div className="floating-label-group login-input-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => {setPassword(e.target.value); if(error) setError("")}}
                            className="campo password-field"
                            placeholder=" "
                            required
                        />
                        <label className="floating-label">Password</label>

                        {password && (
                            <button
                                type="button"
                                className="toggle-password"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        )}
                    </div>

                    <button onClick={handleLogin} className="btnAccedi" disabled={isLoading}>
                        {isLoading ? (
                            <span style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <Loader2 className="animate-spin" size={20} /> Accesso...
                            </span>
                        ) : (
                            "Entra"
                        )}
                    </button>

                </form>
            </div>
        </div>
    );
}