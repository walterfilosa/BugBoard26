import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './Login.css'
import {Eye, EyeOff} from 'lucide-react';

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if(email && password) {
            console.log("Login tentato con:", email, password);
            navigate('/VisualizzaIssue');
        }
        //logica di login

    }

    return (
        <div className="login-page">
            <div className="login-card">
                <img src="/Logo/LogoBugBoard26.svg" alt={"Logo di BugBoard"} className="login-logo"/>
                <h2 className="login-title">Benvenuto</h2>
                <p className="login-subtitle">Inserisci le tue credenziali per accedere</p>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="floating-label-group login-input-group">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            onChange={(e) => setPassword(e.target.value)}
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

                    <button type="submit" className="btnAccedi">
                        Accedi
                    </button>
                </form>
            </div>
        </div>
    );
}