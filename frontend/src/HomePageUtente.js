import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Clock, FileText } from 'lucide-react';
import './HomePageUtente.css'

const mockIssues = [
    { id: 101, title: "Errore nel login con Google", type: "Bug", priority: 5, status: "Aperta" },
    { id: 102, title: "Richiesta documentazione API", type: "Documentation", priority: 2, status: "Chiusa" },
    { id: 103, title: "Aggiungere Dark Mode", type: "Feature", priority: 3, status: "In Corso" },
    { id: 104, title: "Disallineamento Navbar su Mobile", type: "Bug", priority: 4, status: "Aperta" },
    { id: 105, title: "Come resettare la password?", type: "Question", priority: 1, status: "Chiusa" },
    { id: 106, title: "Errore 404 su pagina profilo", type: "Bug", priority: 5, status: "Aperta" },
    { id: 107, title: "Migliorare performance dashboard", type: "Feature", priority: 3, status: "In Corso" },
    { id: 108, title: "Traduzione incompleta in Inglese", type: "Bug", priority: 2, status: "Aperta" },
    { id: 109, title: "Aggiornare termini e condizioni", type: "Documentation", priority: 1, status: "Chiusa" },
    { id: 110, title: "Il footer si sovrappone al contenuto", type: "Bug", priority: 3, status: "Aperta" },
    { id: 111, title: "Richiesta export in PDF", type: "Feature", priority: 4, status: "In Corso" },
    { id: 112, title: "Login lento da Safari", type: "Bug", priority: 4, status: "Aperta" },
    { id: 113, title: "Dove trovo la mia API Key?", type: "Question", priority: 1, status: "Chiusa" },
    { id: 114, title: "Crash dell'app su upload immagini", type: "Bug", priority: 5, status: "Aperta" },
    { id: 115, title: "Nuovo layout per le impostazioni", type: "Feature", priority: 2, status: "In Corso" },
];

export default function HomePageUtente() {

    const [searchTerm, setSearchTerm] = useState("");

    const filteredIssues = mockIssues.filter(issue =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTypeIcon = (type) => {
        switch(type) {
            case "Bug": return <AlertCircle size={16} />;
            case "Feature": return <CheckCircle size={16} />;
            case "Documentation": return <FileText size={16} />;
            default: return <Clock size={16} />;
        }
    };


    return (
        <div className="homepage">
            <div className="homepage-container">
                <h1>Issues</h1>
            </div>

                <div className="header-row">
                    <h1>Le tue issue assegnate</h1>
                </div>

                <div className="issues-table-container">

                    {/* Intestazione */}
                    <div className="issues-header">
                        <div className="col col-title">Titolo</div>
                        <div className="col col-priority">Priorità</div>
                        <div className="col col-type">Tipo</div>
                    </div>

                    <div className="issues-list">
                        {filteredIssues.length > 0 ? (
                            filteredIssues.map((issue) => (
                                <div key={issue.id} className="issue-row">
                                    <div className="col col-title">
                                        <span className="issue-title-text">{issue.title}</span>
                                    </div>

                                    <div className="col col-priority">
                                        <div className="priority-bar-track">
                                            <div
                                                className="priority-bar-fill"
                                                style={{ width: `${(issue.priority / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="priority-text">{issue.priority}/5</span>
                                    </div>

                                    <div className="col col-type">
                                        <div className={`type-badge type-${issue.type.toLowerCase()}`}>
                                            {getTypeIcon(issue.type)}
                                            <span>{issue.type}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-results">
                                <p>Nessuna issue trovata.</p>
                            </div>
                        )}
                    </div>
                </div>
        </div>
    );
}