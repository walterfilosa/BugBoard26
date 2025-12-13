import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './Login.css'
import {Eye, EyeOff, AlertCircle} from 'lucide-react';
import { loginAPI } from './services/api';
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from './context/AuthContext';

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Inserisci email e password!");
            return;
        }

        setIsLoading(true);

        try {
            const response = await loginAPI(email, password);

            if (response.success) {
                login(response.accessToken);

                navigate('/progetti');
            } else {
                setError("Credenziali non valide");
            }

        } catch (err) {
            setError("Errore durante il login. Riprova.");
        } finally {
            setIsLoading(false);
        }
    };

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

                <form onSubmit={handleSubmit} className="login-form">
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

                    <button onClick={handleSubmit} className="btnAccedi" disabled={isLoading}>
                        {isLoading ? (
                            <span style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <LoadingSpinner message="Accesso..."/>
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