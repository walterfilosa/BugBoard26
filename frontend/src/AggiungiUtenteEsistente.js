import React, {useEffect, useState} from 'react';
import { createPortal } from 'react-dom';
import './GestisciUtenti.css';
import { X, Search, ShieldCheck, User2, Plus } from 'lucide-react';
import NoResultMessage from "./NoResultMessage";

export default function AggiungiUtenteEsistente({ users, onSelect, onClose }) {

    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = users.filter(user =>
        user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.cognome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const modalContent = (
        <div className="panel-overlay">
            <div className="panel-card wide-panel">

                <div className="panel-header">
                    <h2>Aggiungi Utente al Progetto</h2>
                    <button className="btn-close-panel" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="panel-content">
                    <p className="panel-description">
                        Seleziona un utente dalla lista sottostante per aggiungerlo.
                    </p>

                    <div className="modal-search-box">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Cerca utente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="users-table-container modal-table">
                        <div className="users-header-panel">
                            <div className="u-col u-col-name">NOME</div>
                            <div className="u-col u-col-surname">COGNOME</div>
                            <div className="u-col u-col-email">EMAIL</div>
                            <div className="u-col u-col-role">RUOLO</div>
                            <div className="u-col u-col-actions"></div>
                        </div>

                        <div className="users-list modal-list">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="user-row-panel"
                                        onClick={() => onSelect(user)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="u-col u-col-name">{user.nome}</div>
                                        <div className="u-col u-col-surname">{user.cognome}</div>
                                        <div className="u-col u-col-email">{user.email}</div>
                                        <div className="u-col u-col-role">
                                            {user.role === 'admin' ? (
                                                <span className="badge-admin"><ShieldCheck size={14} /> Admin</span>
                                            ) : (
                                                <span className="badge-user"><User2 size={14}/> Utente</span>
                                            )}
                                        </div>
                                        <div className="u-col u-col-actions" style={{justifyContent: 'center'}}>
                                            <button className="btn-icon-add">
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <NoResultMessage message={"Nessun utente disponibile trovato"}/>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}