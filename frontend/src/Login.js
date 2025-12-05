import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './Login.css'
import {Eye, EyeOff, AlertCircle} from 'lucide-react';

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");

    const navigate = useNavigate();

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
            navigate('/gestisci-issue');
        } else {
            console.log("Login come Utente");
            navigate('/visualizza-issue');
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
                        <input
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

                    <button onClick={handleLogin} className="btnAccedi">
                        Accedi
                    </button>
                </form>
            </div>
        </div>
    );
}