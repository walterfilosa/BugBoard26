import React, { useState } from 'react';
import './ProfiloUtente.css';
import NavbarUtente from './NavbarUtente';
import { Save } from 'lucide-react';

export default function ProfiloUtente() {

    const [userData, setUserData] = useState({
        id: "882910",
        nome: "Gennaro",
        cognome: "Esposito",
        dataNascita: "1990-05-12",
        email: "gennaro.esposito@email.com",
        password: "passwordSegreta123",
        telefono: "+39 333 1234567"
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        console.log("Dati salvati:", {email: userData.email, telefono: userData.telefono});
        alert("Modifiche salvate con successo!");
    };

    return (
        <div className="page-wrapper">
            <NavbarUtente/>

            <div className="homepage-container profile-container">
                <div className="profile-header">
                    <h1>Il mio Profilo</h1>
                    <p>Gestisci le tue informazioni personali e di contatto</p>
                </div>


                    <h3 className="section-title">Dati Personali <span
                        className="read-only-tag">(Non modificabili)</span></h3>

                    <div className="form-grid">
                        <div className="floating-label-group disabled-group">
                            <input
                                type="text"
                                value={userData.id}
                                className="campo disabled-input"
                                disabled
                            />
                            <label className="floating-label">ID Utente</label>
                        </div>

                        <div className="floating-label-group disabled-group">
                            <input
                                type="date"
                                value={userData.dataNascita}
                                className="campo disabled-input"
                                disabled
                            />
                            <label className="floating-label">Data di Nascita</label>
                        </div>

                        <div className="floating-label-group disabled-group">
                            <input
                                type="text"
                                value={userData.nome}
                                className="campo disabled-input"
                                disabled
                            />
                            <label className="floating-label">Nome</label>
                        </div>

                        <div className="floating-label-group disabled-group">
                            <input
                                type="text"
                                value={userData.cognome}
                                className="campo disabled-input"
                                disabled
                            />
                            <label className="floating-label">Cognome</label>
                        </div>
                    </div>

                    <hr className="divider"/>

                    <h3 className="section-title">Contatti <span
                        className="editable-tag">(Modificabili)</span></h3>

                    <div className="form-grid">
                        <div className="floating-label-group">
                            <input
                                type="email"
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                                className="campo"
                                placeholder=" "
                            />
                            <label className="floating-label">Email</label>
                        </div>

                        <div className="floating-label-group">
                            <input
                                type="tel"
                                name="telefono"
                                value={userData.telefono}
                                onChange={handleChange}
                                className="campo"
                                placeholder=" "
                            />
                            <label className="floating-label">Numero di Telefono</label>
                        </div>
                    </div>

                    <div className="action-row">
                        <button className="btnSalva" onClick={handleSave}>
                            <Save size={18} style={{marginRight: '8px'}}/> Salva modifiche
                        </button>
                    </div>
            </div>
        </div>
    );
}