import './SegnalaIssue.css';
import './NavbarUtente.js';
import React, {useEffect, useState} from "react";
import {AlertTriangle, CircleCheck, Image as ImageIcon, X} from "lucide-react";
import {useNavigate} from "react-router-dom";

const issueTypes = [
    { id: 1, title: "Question", desc: "Per richieste di chiarimenti" },
    { id: 2, title: "Bug", desc: "Per segnalare malfunzionamenti" },
    { id: 3, title: "Documentation", desc: "Per segnalare problemi relativi alla documentazione" },
    { id: 4, title: "Feature", desc: "Per indicare la richiesta o il suggerimento di nuove funzionalità" },
];

export default function SegnalaIssue() {

    const navigate = useNavigate();

    const [selectedType, setSelectedType] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState(3);
    const [image, setImage] = useState(null);
    const [fileName, setFileName] = useState("");

    const [showSuccess, setShowSuccess] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

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
                navigate('/visualizza-issue');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [showSuccess, navigate]);

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
        setFileName("");

        setShowWarning(false);
        navigate('/visualizza-issue');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);

            const reader = new FileReader();
            reader.onload = () => setImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleReset = () => {
        setSelectedType(null);
        setTitle("");
        setDescription("");
        setPriority(3);
        setImage(null);
        setFileName("");
    };

    const handleSubmit = () => {
        setShowSuccess(true);
    }

    return (
        <div className="segnalaissue">

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
                                navigate('/visualizza-issue');
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
                <h1>Segnala issue</h1>
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
                            onClick={(e) => {
                                e.stopPropagation();
                                setImage(null);
                                setFileName("");
                                const fileInput = document.getElementById("fileUpload");
                                if(fileInput) fileInput.value = "";
                            }}
                        >
                            <X size={20} color="#002060"/>
                        </button>
                    )}
                    <input type="file" id="fileUpload" className="hidden" accept="image/*" onChange={handleImageUpload} style={{display: 'none'}}/>
                </div>

                <div className="pulsanti">
                    <button onClick={handleCancelRequest} className={"buttonAnnulla"}>Annulla</button>
                    <button disabled={!isFormValid} className={"buttonInvia"} onClick={handleSubmit}>Invia segnalazione</button>
                </div>
            </div>
        </div>
    )
}