import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Progetti.css';
import { Search, Folder, Clock, CheckCircle, XCircle, ChevronRight, LogOut } from 'lucide-react';
import { mockProjects } from './utils';
import  Footer from "./Footer";

export function Progetti() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const userRole = localStorage.getItem("userRole");
    const isAdmin = userRole === "admin";

    const filteredProjects = mockProjects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase());

        const isVisible = isAdmin ? true : project.status !== "Chiuso";

        return matchesSearch && isVisible;
    });

    const getStatusConfig = (status) => {
        switch (status) {
            case "Attivo":
                return {icon: <CheckCircle size={14}/>, className: "badge-active"};
            case "In sospeso":
                return {icon: <Clock size={14}/>, className: "badge-pending"};
            case "Chiuso":
                return {icon: <XCircle size={14}/>, className: "badge-closed"};
            default:
                return {icon: <Folder size={14}/>, className: ""};
        }
    };

    const handleProjectClick = (projectId) => {
        // Qui navighi alla lista issue di QUEL progetto specifico
        // Es: navigate(`/progetti/${projectId}/issues`);
        // Per ora rimandiamo alla home utente generica o dove preferisci
        if (isAdmin) {
            navigate('/admin/home');
        } else {
            navigate('/home');
        }
    };

    return (
        <div className="projects-page">

            <div className="homepage-container-projects">

                <div className="logo-header">
                    <img src="/Logo/LogoBugBoard26.svg" alt="Logo" className="logo-projects"/>
                    <button className="btnEsci-project"

                            onClick={() => navigate('/')}
                    >
                        <LogOut size={30}/> Esci
                    </button>
                </div>

                <h1>Benvenuto, Gennaro</h1>
                <p className="subtitle">Seleziona un progetto per entrare</p>

                <div className="projects-actions-bar">
                    <div className="search-box project-search">
                        <Search className="search-icon" size={20}/>
                        <input
                            type="text"
                            placeholder="Cerca progetti..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="projects-grid">
                    {filteredProjects.length > 0 ? (
                        filteredProjects.map((project) => {
                            const statusConfig = getStatusConfig(project.status);
                            return (
                                <div
                                    key={project.id}
                                    className="project-card"
                                    onClick={() => handleProjectClick(project.id)}
                                >
                                    <div className="card-top">
                                        <div className={`project-status-badge ${statusConfig.className}`}>
                                            {statusConfig.icon}
                                            <span>{project.status}</span>
                                        </div>
                                    </div>

                                    <h3 className="project-title">{project.title}</h3>
                                    <p className="project-desc">{project.description}</p>
                                    <div className="arrow-icon">
                                        <ChevronRight size={20}/>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-results-box">
                            <Folder size={48} color="#B0B0B0" strokeWidth={1}/>
                            <p>Nessun progetto trovato.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer/>
        </div>
    );
}