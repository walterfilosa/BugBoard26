import './SegnalaIssue.css';
import React, {useEffect, useState} from "react";
import {AlertTriangle, CircleCheck, Image as ImageIcon, X} from "lucide-react";
import {useLocation, useNavigate} from "react-router-dom";
import {createIssue, uploadFile} from "./services/api";
import { useAuth } from './context/AuthContext';
import ErrorMessage from "./ErrorMessage";

const issueTypes = [
    { id: 1, title: "Question", desc: "Per richieste di chiarimenti" },
    { id: 2, title: "Bug", desc: "Per segnalare malfunzionamenti" },
    { id: 3, title: "Documentation", desc: "Per segnalare problemi relativi alla documentazione" },
    { id: 4, title: "Feature", desc: "Per indicare la richiesta o il suggerimento di nuove funzionalità" },
];

export default function SegnalaIssue() {

    const navigate = useNavigate();
    const location = useLocation();

    const { user, isAdmin } = useAuth();
    const currentProjectId = localStorage.getItem("currentProjectId");

    const homePath = isAdmin ? '/admin/home' : '/home';

    const [selectedType, setSelectedType] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState(3);

    // image serve per l'anteprima (Base64), rawFile serve per l'upload (File Object)
    const [image, setImage] = useState(null);
    const [rawFile, setRawFile] = useState(null);
    const [fileName, setFileName] = useState("");

    const [showSuccess, setShowSuccess] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const isFormValid = selectedType && title && description;

    const hasUnsavedChanges =
        selectedType !== null ||
        title !== "" ||
        description !== "" ||
        image !== null ||
        priority !== 3;

    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                setShowSuccess(false);
                navigate(homePath);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [showSuccess, navigate, homePath]);

    const handleCancelRequest = () => {
        if (hasUnsavedChanges) {
            setShowWarning(true);
        } else {
            handleForceExit();
        }
    };

    const handleForceExit = () => {
        setSelectedType(null);
        setTitle("");
        setDescription("");
        setPriority(3);
        setImage(null);
        setRawFile(null);
        setFileName("");

        setShowWarning(false);
        navigate(homePath);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            setRawFile(file);

            const reader = new FileReader();
            reader.onload = () => setImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (e) => {
        e.stopPropagation();
        setImage(null);
        setRawFile(null);
        setFileName("");
        const fileInput = document.getElementById("fileUpload");
        if(fileInput) fileInput.value = "";
    };

    const handleSubmit = async () => {
        if (!isFormValid) return;

        if (!user || !user.id) {
            setErrorMsg("Errore: Utente non identificato. Effettua nuovamente il login.");
            return;
        }

        if (!currentProjectId) {
            setErrorMsg("Errore: Nessun progetto selezionato.");
            return;
        }

        setIsSubmitting(true);
        setErrorMsg(null);

        try {
            let uploadedImageUrl = null;

            if (rawFile) {
                try {
                    uploadedImageUrl = await uploadFile(rawFile);
                } catch (uploadError) {
                    console.error("Errore upload immagine:", uploadError);
                    setErrorMsg("Impossibile caricare l'immagine. Riprova o rimuovi l'allegato.");
                    setIsSubmitting(false);
                    return;
                }
            }

            const selectedTypeObj = issueTypes.find(t => t.id === selectedType);
            const typeString = selectedTypeObj ? selectedTypeObj.title : "Generic";

            const newIssueData = {
                tipo: typeString,
                titolo: title,
                descrizione: description,
                priorita: priority,
                linkImmagine: uploadedImageUrl,
                stato: "ToDo",
                assignee: null,
                EmailCr: user.email
            };

            await createIssue(currentProjectId, user.id, newIssueData);

            setIsSubmitting(false);
            setShowSuccess(true);
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
            setErrorMsg("Si è verificato un errore durante l'invio della segnalazione. Riprova più tardi.");
        }
    }

    return (
        <div className="segnalaissue">

            {errorMsg && (
                <div className="error-overlay">
                    <div className="error-panel">
                        <div className="error-content">
                            <ErrorMessage message={errorMsg} buttonRefresh={false}/>
                            <button className="btn-close-success" style={{width: "40%", backgroundColor: "#d32f2f"}} onClick={() => setErrorMsg(null)}>OK</button>
                        </div>
                    </div>
                </div>
            )}

            {showSuccess && (
                <div className="success-overlay">
                    <div className="success-card">
                        <CircleCheck size={64} className="success-icon" />
                        <h2>Segnalazione Inviata!</h2>
                        <p>La tua issue è stata registrata con successo.</p>
                        <p>Il Project Admin la assegnerà ad un membro del team il prima possibile</p>
                        <p className="redirect-text">Sarai reindirizzato a breve alla tua HomePage...</p>

                        <button
                            className="btn-close-success"
                            onClick={() => {
                                setShowSuccess(false);
                                navigate(homePath);
                            }}
                        >
                            Chiudi e vai alle Issue
                        </button>
                    </div>
                </div>
            )}

            {showWarning && (
                <div className="overlay warning-overlay">
                    <div className="card-overlay warning-card">
                        <AlertTriangle size={64} className="icon-overlay warning-icon" />
                        <h2>Modifiche non salvate</h2>
                        <p>Se esci, tutte le modifiche andranno perse.</p>

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

            <div className="homepage-container">
                <div className="titolo-pagina">
                    <h1>Segnala Issue</h1>
                </div>
                <label className={"obbligatorio"}>I campi contrassegnati con * sono obbligatori</label>
                <label className={"label-tipo-issue"}>Tipo di issue: *</label>
                <div className="tipo-issue">
                    {issueTypes.map((type) => (
                        <div
                            key={type.id}
                            className={`issue-type-box ${selectedType === type.id ? "active" : ""}`}
                            onClick={() => setSelectedType(type.id)}
                        >
                            <h3 className="titolo-tipo">{type.title}</h3>
                            <p className="descrizione-tipo">{type.desc}</p>
                        </div>
                    ))}
                </div>
                <div className="floating-label-group">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="campo"
                        placeholder=" "
                    />
                    <label className="floating-label">Titolo *</label>
                </div>
                <div className="floating-label-group textarea-group">
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={" "} rows={4} className={"campo campo-textarea"}/>
                    <label className="floating-label textarea-label">Descrizione *</label>
                </div>
                <div className="priority-container">
                    <label className="label-priorita">Priorità: {priority}</label>
                    <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={priority}
                        onChange={(e) => setPriority(parseInt(e.target.value))}
                        className="priority-slider"

                        style={{
                            backgroundImage: `
                linear-gradient(to right, transparent ${((priority - 1) / 4) * 100}%, #E0E0E0 ${((priority - 1) / 4) * 100}%),
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
                <label className="label-tipo-issue">Allega immagine</label>
                {fileName && (
                    <p className="nome-file-caricato">
                        File selezionato: <span>{fileName}</span>
                    </p>
                )}
                <div className="inserisci-immagine" onClick={() => document.getElementById("fileUpload").click()} style={{ backgroundImage: image ? `url(${image})` : "none", backgroundSize: "cover", backgroundPosition: "center" }}>
                    {!image &&
                        <div className="placeholder-content">
                            <ImageIcon size={48} color="#B0B0B0" />
                            <span className="testo-placeholder">Clicca qui per inserire un'immagine</span>
                        </div>
                    }
                    {image && (
                        <button
                            className="pulsante-rimuovi-img"
                            onClick={handleRemoveImage}
                        >
                            <X size={20} color="#002060"/>
                        </button>
                    )}
                    <input type="file" id="fileUpload" className="hidden" accept="image/*" onChange={handleImageUpload} style={{display: 'none'}}/>
                </div>

                <div className="pulsanti">
                    <button onClick={handleCancelRequest} className={"buttonAnnulla"}>Annulla</button>
                    <button disabled={!isFormValid || isSubmitting} className={"buttonInvia"} onClick={handleSubmit}>
                        {isSubmitting ? "Invio in corso..." : "Invia segnalazione"}
                    </button>
                </div>
            </div>
        </div>
    )
}