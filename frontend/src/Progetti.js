import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Progetti.css';
import { Search, Folder, Clock, CheckCircle, XCircle, ChevronRight, LogOut } from 'lucide-react';
import  Footer from "./Footer";
import { useAuth } from './context/AuthContext';
import { getProjectsByUserId, getAssignedActiveProjectsFromUserId } from './services/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from "./ErrorMessage";

export function Progetti() {
    const navigate = useNavigate();
    const { user, logout, isAdmin } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchProjects = async () => {
            if (!user || !user.id) return;

            try {
                setLoading(true);
                let data;

                if (isAdmin) {
                    data = await getProjectsByUserId(user.id);
                } else {
                    data = await getAssignedActiveProjectsFromUserId(user.id);
                }

                setProjects(data);
            } catch (err) {
                console.error(err);
                setError("Impossibile caricare i progetti.");
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [user, isAdmin]);

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
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
        localStorage.setItem("currentProjectId", projectId);

        const isUserAdmin = isAdmin || localStorage.getItem("userRole") === 'admin';

        if (isUserAdmin) {
            navigate('/admin/home');
        } else {
            navigate('/home');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) return <LoadingSpinner message="Recupero i tuoi progetti..." />;

    if (error) return (
        <ErrorMessage message={error}/>
    );

    if (!user) {
        return null;
    }

    return (
        <div className="projects-page">

            <div className="homepage-container-projects">

                <div className="logo-header">
                    <img src="/Logo/LogoBugBoard26.svg" alt="Logo" className="logo-projects"/>
                    <button className="btnEsci-project" onClick={handleLogout}>
                        <LogOut size={30}/> Esci
                    </button>
                </div>

                <h1>Benvenuto, {user.nome || user.email?.split('@')[0] || "Utente"}</h1>
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
                            <p>{searchTerm
                                ? "Nessun progetto corrisponde alla ricerca."
                                : "Non hai progetti attivi al momento."}</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer/>
        </div>
    );
}