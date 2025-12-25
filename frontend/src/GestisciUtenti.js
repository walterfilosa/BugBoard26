import React, {useEffect, useState} from 'react';
import './GestisciUtenti.css';
import { useNavigate } from 'react-router-dom';
import {mockTeamUsers, mockUsers, potentialUsersToAdd} from './utils';
import {Search, ChevronDown, ChevronUp, UserPlus, ShieldCheck, User2, CircleCheck, AlertCircle} from "lucide-react";
import DettaglioUtente from './DettaglioUtente';
import AggiungiUtenteEsistente from "./AggiungiUtenteEsistente";
import LoadingSpinner from './LoadingSpinner';
import { getUsersByProjectId, getAllUsersExceptProject, assignProjectToUser } from './services/api';
import ErrorMessage from "./ErrorMessage";
import NoResultMessage from "./NoResultMessage";

export default function GestisciUtenti() {

    const navigate = useNavigate();

    const currentProjectId = localStorage.getItem("currentProjectId") || 1;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [usersList, setUsersList] = useState([]);

    const [showAddPanel, setShowAddPanel] = useState(false);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [loadingAvailable, setLoadingAvailable] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

    const [showSuccess, setShowSuccess] = useState(false);
    const [addedUserName, setAddedUserName] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchProjectUsers = async () => {
        try {
            setLoading(true);
            const data = await getUsersByProjectId(currentProjectId);
            setUsersList(data);
        } catch (err) {
            console.error(err);
            setError("Impossibile caricare la lista utenti.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentProjectId) {
            fetchProjectUsers();
        }
    }, [currentProjectId]);

    useEffect(() => {
        const fetchAvailableUsers = async () => {
            if (showAddPanel) {
                try {
                    setLoadingAvailable(true);
                    const data = await getAllUsersExceptProject(currentProjectId);
                    setAvailableUsers(data);
                } catch (err) {
                    console.error("Errore caricamento utenti disponibili", err);
                } finally {
                    setLoadingAvailable(false);
                }
            }
        };
        fetchAvailableUsers();
    }, [showAddPanel, currentProjectId]);

    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    const filteredUsers = usersList.filter(user => {
        const matchesSearch =
            (user.nome || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.cognome || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email || "").toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === "All" || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (!sortConfig.key) return 0;

        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const renderSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) return <ChevronDown size={16} className="sort-icon inactive" />;
        return sortConfig.direction === 'asc'
            ? <ChevronUp size={16} className="sort-icon active" />
            : <ChevronDown size={16} className="sort-icon active" />;
    };

    const handleUserSelectedToAdd = async (userToAdd) => {
        console.log(`ID inviato al backend: ${userToAdd.id}`);

        try {
            await assignProjectToUser(userToAdd.id, currentProjectId);
            setUsersList(prev => [...prev, userToAdd]);
            setAvailableUsers(prev => prev.filter(u => u.id !== userToAdd.id));
            setShowAddPanel(false);
            setAddedUserName(`${userToAdd.nome} ${userToAdd.cognome}`);
            setShowSuccess(true);
        } catch (err) {
            alert("Errore durante l'aggiunta dell'utente.");
        }
    };

    const handleAddUser = () => {
        console.log("Naviga a creazione Utente");
        navigate('/admin/nuovo-utente');
    };

    if (loading) return <LoadingSpinner message="Caricamento utenti..." />;

    if (error) return (
        <ErrorMessage message={error} marginTop={"65px"}/>
    );

    return (
        <div className="homepage">

            {showSuccess && (
                <div className="success-overlay">
                    <div className="success-card">
                        <CircleCheck size={64} className="success-icon" />
                        <h2>Utente Aggiunto!</h2>
                        <p><b>{addedUserName}</b> è stato aggiunto correttamente alla lista.</p>
                        <button className="btn-close-success" onClick={() => setShowSuccess(false)}>Chiudi</button>
                    </div>
                </div>
            )}

            {selectedUser && (
                <DettaglioUtente
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}

            {showAddPanel && (
                <AggiungiUtenteEsistente
                    users={availableUsers}
                    loading={loadingAvailable}
                    onSelect={handleUserSelectedToAdd}
                    onClose={() => setShowAddPanel(false)}
                />
            )}

            <div className="homepage-container">
                <h1>Gestisci Utenze</h1>
            </div>

            <div className="action-buttons-group">
                <button className="btn-action btn-add-user" onClick={() => setShowAddPanel(true)}>
                    <UserPlus size={18} /> Aggiungi Utente al Progetto
                </button>
                <button className="btn-action btn-add-user" onClick={handleAddUser}>
                    <UserPlus size={18} /> Crea un Nuovo Utente
                </button>
            </div>

            <div className="users-filters-container">
                <div className="filters-left">
                    <div className="search-box">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Cerca per nome, cognome o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="filters-right">
                    <span className="filter-label">Filtra per ruolo:</span>
                    <div className="role-toggle-slider">

                        <div
                            className={`sliding-pill ${
                                roleFilter === 'All' ? 'pos-0' :
                                    roleFilter === 'admin' ? 'pos-1' : 'pos-2'
                            }`}
                        />
                        <button
                            className={`slider-btn ${roleFilter === 'All' ? 'active' : ''}`}
                            onClick={() => setRoleFilter('All')}
                        >
                            Tutti
                        </button>
                        <button
                            className={`slider-btn-admin ${roleFilter === 'admin' ? 'active' : ''}`}
                            onClick={() => setRoleFilter('admin')}
                        >
                            <ShieldCheck size="18"/> Admin
                        </button>
                        <button
                            className={`slider-btn-user ${roleFilter === 'user' ? 'active' : ''}`}
                            onClick={() => setRoleFilter('user')}
                        >
                            <User2 size="18"/> Utenti
                        </button>
                    </div>
                </div>
            </div>

            <div className="users-table-container">
                <div className="users-header">
                    <div className="u-col u-col-id sortable-header" onClick={() => handleSort('id')}>
                        ID {renderSortIcon('id')}
                    </div>
                    <div className="u-col u-col-name sortable-header" onClick={() => handleSort('nome')}>
                        Nome {renderSortIcon('nome')}
                    </div>
                    <div className="u-col u-col-surname sortable-header" onClick={() => handleSort('cognome')}>
                        Cognome {renderSortIcon('cognome')}
                    </div>
                    <div className="u-col u-col-email">
                        Email
                    </div>
                    <div className="u-col u-col-role">
                        Ruolo
                    </div>
                </div>

                <div className="users-list">
                    {sortedUsers.length > 0 ? (
                        sortedUsers.map((user) => (
                            <div key={user.id} className="user-row" onClick={() => setSelectedUser(user)} style={{ cursor: 'pointer' }}>
                                <div className="u-col u-col-id">#{user.id}</div>
                                <div className="u-col u-col-name">{user.nome}</div>
                                <div className="u-col u-col-surname">{user.cognome}</div>
                                <div className="u-col u-col-email">{user.email}</div>

                                <div className="u-col u-col-role">
                                    {user.role === 'admin' ? (
                                        <span className="badge-admin">
                                            <ShieldCheck size={18} /> Admin
                                        </span>
                                    ) : (
                                        <span className="badge-user">
                                            <User2 size={18}/> Utente</span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <NoResultMessage message={"Nessun utente trovato"}/>
                    )}
                </div>
            </div>
        </div>
    )
}