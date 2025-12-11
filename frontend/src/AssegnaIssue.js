import React, { useState } from 'react';
import './GestisciUtenti.css';
import { X, Search, ShieldCheck, User2, UserCheck } from 'lucide-react';

export default function AssegnaIssue({ users, onSelect, onClose }) {

    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = users.filter(user =>
        user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.cognome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="panel-overlay">
            <div className="panel-card wide-panel">

                <div className="panel-header">
                    <h2>Assegna Issue a un Membro del Team</h2>
                    <button className="btn-close-panel" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="panel-content">
                    <p className="panel-description">
                        Seleziona l'utente del team a cui assegnare la issue.
                    </p>

                    <div className="modal-search-box">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Cerca membro..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="users-table-container modal-table">
                        <div className="users-header-panel-assigneed">
                            <div className="u-col u-col-name">Nome</div>
                            <div className="u-col u-col-surname">Cognome</div>
                            <div className="u-col u-col-email">Email</div>
                            <div className="u-col u-col-actions" style={{justifyContent: 'center'}}>Assegna</div>
                        </div>

                        <div className="users-list modal-list">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="modal-user-row"
                                        onClick={() => onSelect(user)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="u-col u-col-name">{user.nome}</div>
                                        <div className="u-col u-col-surname">{user.cognome}</div>
                                        <div className="u-col u-col-email">{user.email}</div>
                                        <div className="u-col u-col-actions" style={{justifyContent: 'center'}}>
                                            <button className="btn-icon-assign">
                                                <UserCheck size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-results">Nessun utente trovato.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}