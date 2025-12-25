import React, {useEffect, useRef, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import './DettaglioIssue.css';
import {ArrowLeft, Edit2, Trash2, Save, X, Image as ImageIcon, Upload, UploadCloud, AlertCircle, AlertTriangle, CircleCheck} from 'lucide-react';
import { getTypeIcon } from './utils';
import StatusTracker from "./Statustracker";
import AssegnaIssue from "./AssegnaIssue";
import { useAuth } from './context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import {
    getIssueById,
    updateIssue,
    deleteIssue,
    getUserById,
    assignIssueToUser,
    setIssueAsSolved,
    uploadFile
} from './services/api';
import ErrorMessage from "./ErrorMessage";

export function DettaglioIssue() {
    const {id} = useParams();
    const navigate = useNavigate();

    const { user, isAdmin } = useAuth();

    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(null);
    const [showAssignPanel, setShowAssignPanel] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [newImageFile, setNewImageFile] = useState(null);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [showSuccess, setShowSuccess] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    useEffect(() => {
        const fetchIssueDetail = async () => {
            try {
                setLoading(true);
                const data = await getIssueById(id);
                console.log("Dati Issue ricevuti:", data);
                setIssue(data);
                setEditedData(data);
            } catch (err) {
                console.error(err);
                setError("Issue non trovata o errore di connessione.");
            } finally {
                setLoading(false);
            }
        };

        fetchIssueDetail();
    }, [id]);

    useEffect(() => {
        const fetchAssigneeName = async () => {
            if (issue && issue.assigneeId) {
                try {
                    const userData = await getUserById(issue.assigneeId);
                    const fullName = `${userData.nome} ${userData.cognome}`;
                    setIssue(prev => ({ ...prev, assigneeName: fullName }));
                    setEditedData(prev => ({ ...prev, assigneeName: fullName }));
                } catch (err) {
                    console.error("Impossibile recuperare nome assegnatario", err);
                }
            }
        };
        fetchAssigneeName();
    }, [issue?.assigneeId]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setEditedData(prev => ({...prev, [name]: value}));
    }

    const handleOpenAssignPanel = () => {
        setShowAssignPanel(true);
    };

    const handleAssignUser = async (selectedUser) => {

        const newAssigneeName = selectedUser.nome
            ? `${selectedUser.nome} ${selectedUser.cognome || ''}`.trim()
            : selectedUser.email.split('@')[0];

        const newData = {
            ...issue,
            status: "Assegnata",
            assigneeId: selectedUser.id,
            assigneeEmail: selectedUser.email,
            assigneeName: newAssigneeName
        };

        try {
            await assignIssueToUser(issue.id, selectedUser.id);
            setIssue(newData);
            setEditedData(newData);
            setShowAssignPanel(false);
        } catch (err) {
            alert("Errore durante l'assegnazione");
        }
    };

    const handleStatusChange = (newStatus) => {
        setEditedData(prev => ({ ...prev, status: newStatus }));
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        try {
            setIsDeleting(true);
            await deleteIssue(id);
            navigate(isAdmin ? '/admin/home' : '/home');
        } catch (err) {
            console.error("Errore dettagliato:", err);
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    if (loading) return <LoadingSpinner message="Caricamento dettaglio..." />;

    if (error) return (
        <div style={{padding: 140, textAlign: 'center', color: 'red'}}>
            <AlertCircle size={48} style={{margin:'0 auto 10px'}}/>
            <h2>Errore</h2>
            <p>{error}</p>
            <button className="btn-indietro" onClick={() => navigate(-1)} style={{marginTop:20}}>Torna indietro</button>
        </div>
    );

    const isAssignedToCurrentUser = issue.assigneeEmail === user?.email;
    const canResolve = isAssignedToCurrentUser || isAdmin;

    const canEdit = isAdmin;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImageFile(file);

            const reader = new FileReader();
            reader.onload = () => {
                setEditedData(prev => ({
                    ...prev,
                    image: reader.result,
                    fileName: file.name
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileUpload = () => {
        if (isEditing && fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleSave = async () => {
        try {
            setIsSaving(true);

            let finalImageUrl = editedData.image;

            if (newImageFile) {
                try {
                    finalImageUrl = await uploadFile(newImageFile);
                } catch (uploadErr) {
                    console.error("Errore upload:", uploadErr);
                    alert("Impossibile caricare la nuova immagine. Riprova.");
                    setIsSaving(false);
                    return;
                }
            }

            const payload = {
                ...editedData,
                image: finalImageUrl
            };

            await updateIssue(payload);

            setIssue(payload);
            setEditedData(payload);

            setNewImageFile(null);
            setIsEditing(false);

            setShowSuccess(true);

        } catch (err) {
            console.error(err);
            alert("Errore durante il salvataggio della issue");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditedData(issue);
        setNewImageFile(null);
        setIsEditing(false);
    };

    const assigneeNameDisplay = issue.assigneeName || (issue.assigneeEmail ? issue.assigneeEmail.split('@')[0] : null);

    const currentData = isEditing ? editedData : issue;

    const handleMarkAsSolved = async () => {
        const newData = { ...issue, status: "Risolta" };

        try {
            await setIssueAsSolved(issue.id);
            const newData = { ...issue, status: "Risolta" };
            setIssue(newData);
            setEditedData(newData);
        } catch (err) {
            <ErrorMessage message="Impossibile aggiornare lo stato"/>
        }
    };

    return (
        <div className="page-init">

            {showSuccess && (
                <div className="success-overlay">
                    <div className="success-card">
                        <CircleCheck size={48} color="#4dd32f" className="success-icon"/>
                        <h2>Modifiche Salvate!</h2>
                        <p>Le informazioni della issue sono state aggiornate con successo.</p>
                        <button
                            className="btn-close-success"
                            onClick={() => setShowSuccess(false)}
                        >
                            Chiudi
                        </button>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="overlay-delete">
                    <div className="card-delete">
                        <div className="icon-box-delete">
                            <AlertTriangle size={48} color="#d32f2f" />
                        </div>
                        <h2>Sei sicuro?</h2>
                        <p>
                            Stai per eliminare definitivamente la issue.
                            <br/>Questa azione è irreversibile.
                        </p>

                        <div className="delete-actions">
                            <button
                                className="btn-cancel-delete"
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                                type="button"
                            >
                                Annulla
                            </button>
                            <button
                                type="button"
                                className="btn-confirm-delete"
                                onClick={(e) => confirmDelete(e)}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Eliminazione..." : "Elimina Issue"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAssignPanel && (
                <AssegnaIssue
                    projectId={localStorage.getItem("currentProjectId")}
                    onSelect={handleAssignUser}
                    onClose={() => setShowAssignPanel(false)}
                />
            )}


            <div className="pulsanti-azioni">
                <button className="btn-indietro"
                        onClick={() => navigate(isAdmin ? '/admin/home' : '/home')}>
                    <ArrowLeft size={20}/> Torna alla lista
                </button>


                <div className="central-actions">
                    {canEdit && (
                        <div className="edit-actions-container">
                            {!isEditing ? (
                                <button className="btn-edit-mode" onClick={() => setIsEditing(true)}>
                                    <Edit2 size={20}/> Modifica Issue
                                </button>
                            ) : (
                                <div className="edit-buttons-group">
                                    <button className="btn-save" onClick={handleSave}>
                                        <Save size={20}/> Salva
                                    </button>
                                    <button className="btn-cancel" onClick={handleCancel}>
                                        <X size={20}/> Annulla
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {isAdmin && !isEditing && (
                        <button className="btn-delete-issue" onClick={handleDeleteClick}>
                            <Trash2 size={20}/> Elimina Issue
                        </button>
                    )}
                </div>
            </div>

            <StatusTracker
                status={isEditing ? editedData.status : issue.status}
                assigneeName={assigneeNameDisplay}
                onMarkAsSolved={handleMarkAsSolved}
                onMarkAsAssigned={handleOpenAssignPanel}
                isEditing={isEditing}
                onStatusChange={handleStatusChange}

                canResolve={canResolve}
            />


            <div className={"detail-container"}>

            <div className="detail-header">
                <div className="id-testo">
                    <span className="meta-label">ID:</span> #{issue.id}
                </div>

                {isEditing ? (
                    <select
                        name="type"
                        className="edit-type-select"
                        value={editedData.type}
                        onChange={handleInputChange}
                    >
                        <option value="Bug">Bug</option>
                        <option value="Feature">Feature</option>
                        <option value="Documentation">Documentation</option>
                        <option value="Question">Question</option>
                    </select>
                ) : (
                    <div className={`detail-type-badge type-${(issue.type|| "generic").toLowerCase()}`}>
                        {getTypeIcon(issue.type || "bug", 20)}
                        {issue.type || "Tipo sconosciuto"}
                    </div>
                )}
            </div>

            <hr className="divider"/>

            {isEditing ? (
                <input
                    type="text"
                    name="title"
                    className="edit-input-title"
                    placeholder="Titolo"
                    value={editedData.title}
                    onChange={handleInputChange}
                />
            ) : (
                <h1 className="detail-title">{issue.title}</h1>
            )}


            <p className="detail-description">
                {isEditing ? (
                    <textarea
                        name="description"
                        className="edit-textarea"
                        placeholder="Descrizione"
                        rows="1"
                        value={editedData.description}

                        onChange={(e) => {
                            handleInputChange(e);

                            e.target.style.height = "auto";
                            e.target.style.height = e.target.scrollHeight + "px";
                        }}
                        onFocus={(e) => {
                            e.target.style.height = "auto";
                            e.target.style.height = e.target.scrollHeight + "px";
                        }}
                    />
                ) : (
                    <p className="detail-description">
                        {issue.description || "Nessuna descrizione fornita."}
                    </p>
                )}
            </p>

            <div className="detail-section">
                <h3>Priorità: {editedData.priority}</h3>

                {isEditing ? (
                    <div className="priority-container">
                        <input
                            type="range"
                            name="priority"
                            min="1" max="5"
                            value={editedData.priority}
                            onChange={handleInputChange}
                            className="priority-slider"

                            style={{
                                backgroundImage: `
                linear-gradient(to right, transparent ${((editedData.priority - 1) / 4) * 100}%, #E0E0E0 ${((editedData.priority - 1) / 4) * 100}%),
                linear-gradient(to right, #8F00FF 0%, #0000FF 25%, #00FF00 50%, #FFFF00 75%, #FF0000 100%)
            `
                            }}
                        />
                        <div className={"label-numeri"}>
                            <span>1</span>
                            <span>2</span>
                            <span>3</span>
                            <span>4</span>
                            <span>5</span>
                        </div>
                    </div>

                ) : (
                    <div className="detail-priority-wrapper">
                        <div className="priority-bar-track-large">
                            <div
                                className="priority-bar-fill-fluid"
                                style={{width: `${((issue.priority / 5)) * 100}%`}}
                            ></div>
                        </div>
                    </div>
                )}
            </div>


                <div className="detail-section">
                    <h3>Immagine</h3>
                    <div className="overlay-filename-badge" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>

                        {currentData.image && !currentData.image.startsWith('data:') ? (
                            <div style={{ wordBreak: 'break-all', fontSize: '14px', lineHeight: '1.4' }}>
                                <span style={{ fontFamily: 'NeueHaasGroteskDisp Pro Blk', marginRight: '5px' }}>Link:</span>
                                <a
                                    href={currentData.image}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#B0B0B0', textDecoration: 'underline' }}
                                >
                                    {currentData.image}
                                </a>
                            </div>
                        ) : (
                            <span>File: {currentData.fileName || "Nessuna immagine caricata"}</span>
                        )}

                    </div>
                    <div className={`detail-image-container ${isEditing ? "editable" : ""}`} onClick={triggerFileUpload}>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{display: 'none'}}
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {currentData.image ? (
                            <>
                                <img src={currentData.image} alt="Allegato issue" className="detail-image" />

                                {isEditing && (
                                    <div className="image-edit-overlay">
                                        <div className="overlay-content">
                                            <Upload size={40} strokeWidth={2} className="bounce-icon" />
                                            <span className="overlay-title">Cambia immagine</span>
                                            <span className="overlay-subtitle">Clicca per sostituire</span>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                {isEditing ? (
                                    <div className="upload-cta-placeholder">
                                        <UploadCloud size={64} strokeWidth={1.5} color="#002060" className="bounce-icon" />
                                        <span className="cta-title">Carica un'immagine</span>
                                        <span className="cta-subtitle">Clicca qui per sfogliare i file</span>
                                    </div>
                                ) : (
                                    <div className="no-image-placeholder">
                                        <ImageIcon size={48} color="#B0B0B0" strokeWidth={1.5} />
                                        <span>Nessuna immagine caricata</span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
        </div>
            </div>
        </div>
    );
}