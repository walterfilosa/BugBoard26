import React, { useState, useEffect } from 'react';
import './NuovoUtente.css'
import { useNavigate } from 'react-router-dom';
import {
    User,
    ShieldCheck,
    Mail,
    Eye,
    EyeOff,
    Save,
    Phone,
    X,
    CheckCircle,
    AlertTriangle,
    ArrowLeft
} from "lucide-react";
import PrefixMenu from "./PrefixMenu";
import { createUser } from './services/api';

export default function NuovoUtente() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nome: '',
        cognome: '',
        dataNascita: '',
        telefono: '',
        email: '',
        password: '',
        role: 'user',
        prefisso: '+39'
    });

    const handlePrefixChange = (newPrefix) => {
        setFormData({ ...formData, prefisso: newPrefix });
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [showWarning, setShowWarning] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const hasUnsavedChanges =
        formData.nome !== '' ||
        formData.cognome !== '' ||
        formData.dataNascita !== '' ||
        formData.telefono !== '' ||
        formData.email !== '' ||
        formData.password !== '' ||
        formData.role !== 'user';

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'telefono') {
            if (!/^\d*$/.test(value)) {
                return;
            }
            if (value.length > 11) {
                return;
            }
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const isFormValid =
        formData.nome &&
        formData.cognome &&
        formData.dataNascita &&
        formData.telefono &&
        formData.email &&
        formData.password;

    const handleSubmit = async () => {
        if (!isFormValid) return;

        setIsSubmitting(true);
        setErrorMsg(null);

        const userPayload = {
            nome: formData.nome,
            cognome: formData.cognome,
            dataNascita: formData.dataNascita,
            email: formData.email,
            numeroTelefono: `${formData.prefisso} ${formData.telefono}`,
            password: formData.password,
            role: formData.role
        };

        try {
            const createdUser = await createUser(userPayload);

            if (createdUser && createdUser.id) {
                setShowSuccess(true);
            } else {
                throw new Error("Creazione fallita: ID utente non ricevuto.");
            }

        } catch (error) {
            console.error(error);
            setErrorMsg("Si è verificato un errore durante la creazione. Riprova.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelRequest = () => {
        if (hasUnsavedChanges) {
            setShowWarning(true);
        } else {
            handleForceExit();
        }
    };

    const handleForceExit = () => {
        setShowWarning(false);
        navigate('/admin/gestione-utenze');
    };

    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                navigate('/admin/gestione-utenze');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess, navigate]);

    return (
        <div className="homepage-container fix-width">

            {showSuccess && (
                <div className="success-overlay">
                    <div className="success-card">
                        <CheckCircle size={64} className="success-icon" />
                        <h2>Utente Creato!</h2>
                        <p>L'account per <b>{formData.nome} {formData.cognome}</b> è stato creato con successo.</p>
                    </div>
                </div>
            )}

            {errorMsg && (
                <div style={{
                    backgroundColor: '#ffebee', color: '#c62828', padding: '15px',
                    borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems:'center', gap:10
                }}>
                    <AlertTriangle size={20}/> {errorMsg}
                </div>
            )}

            {showWarning && (
                <div className="overlay warning-overlay">
                    <div className="card-overlay warning-card">
                        <AlertTriangle size={64} className="icon-overlay warning-icon" />
                        <h2>Modifiche non salvate</h2>
                        <p>Stai per abbandonare la creazione dell'utente.<br/>Tutti i dati inseriti andranno persi.</p>

                        <div className="overlay-buttons">
                            <button className="btn-overlay btn-stay" onClick={() => setShowWarning(false)}>
                                Rimani qui
                            </button>
                            <button className="btn-overlay btn-leave" onClick={handleForceExit}>
                                Esci
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="profile-header">

                <button className="btn-indietro-nuovo-utente"
                        onClick={handleCancelRequest}>
                    <ArrowLeft size={20}/> Torna alla lista
                </button>

                        <h1>Aggiungi Utente</h1>
                        <p>Inserisci i dati per registrare un nuovo membro nel sistema.</p>

                <div className="role-selection-area">
                    <span className="role-label">Tipologia Account:</span>
                    <div className="role-slider-container">
                        <div className={`role-pill ${formData.role === 'admin' ? 'right' : 'left'}`}></div>

                        <div
                            className={`role-option ${formData.role === 'user' ? 'active' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, role: 'user' }))}
                        >
                            <User size={20} /> Utente
                        </div>

                        <div
                            className={`role-option-admin ${formData.role === 'admin' ? 'active' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, role: 'admin' }))}
                        >
                            <ShieldCheck size={20} /> Admin
                        </div>
                    </div>
                </div>


                    <div className="form-grid-create">

                        <div className="floating-label-group">
                            <input
                                type="text" name="nome" value={formData.nome} onChange={handleChange}
                                className="campo" placeholder=" "
                            />
                            <label className="floating-label">Nome *</label>
                        </div>

                        <div className="floating-label-group">
                            <input
                                type="text" name="cognome" value={formData.cognome} onChange={handleChange}
                                className="campo" placeholder=" "
                            />
                            <label className="floating-label">Cognome *</label>
                        </div>

                        <div className="floating-label-group">
                            <input
                                type="date" name="dataNascita" value={formData.dataNascita} onChange={handleChange}
                                className="campo" placeholder=" "
                            />
                            <label className="floating-label">Data di Nascita *</label>
                        </div>

                        <div className="phone-row-container">
                            <PrefixMenu
                                selectedPrefix={formData.prefisso}
                                onSelect={handlePrefixChange}
                                disabled={false}
                            />

                            <div className="floating-label-group">
                                <input
                                    type="tel" name="telefono" value={formData.telefono} onChange={handleChange}
                                    className="campo" placeholder=" "
                                />
                                <label className="floating-label">Telefono *</label>
                                <Phone className="input-icon-right" size={20} />
                            </div>
                        </div>


                        <div className="floating-label-group">
                            <input
                                type="email" name="email" value={formData.email} onChange={handleChange}
                                className="campo" placeholder=" "
                            />
                            <label className="floating-label">Email *</label>
                            <Mail className="input-icon-right" size={20} />
                        </div>

                        <div className="floating-label-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password" value={formData.password} onChange={handleChange}
                                className="campo password-field" placeholder=" "
                            />
                            <label className="floating-label">Password *</label>

                            <button
                                className="toggle-password-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                type="button"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                    </div>

                    <div className="actions-footer">
                        <button className="btn-cancel-create" onClick={handleCancelRequest}>
                            <X size={20} /> Annulla
                        </button>

                        <button
                            className="btn-save-create"
                            disabled={!isFormValid}
                            onClick={handleSubmit}
                        >
                            <Save size={20} /> Crea Utenza
                        </button>
                    </div>

            </div>
        </div>
    );
}