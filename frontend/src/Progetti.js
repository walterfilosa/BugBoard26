import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Progetti.css';
import { Search, Folder, Clock, CheckCircle, XCircle, ChevronRight, LogOut, User } from 'lucide-react';
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

    const handleGoToProfile = () => {
        navigate('/profilo-progetti');
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
                    <div style={{display: 'flex', gap: '15px'}}>
                        <button className="btnEsci-project" onClick={handleGoToProfile} style={{color: '#002060'}}>
                            <User size={30}/> Profilo
                        </button>
                        <button className="btnEsci-project" onClick={handleLogout}>
                        <LogOut size={30}/> Esci
                    </button>
                    </div>
                </div>

                <h1 style={{ animationDelay: '100ms' }}>Benvenuto, {user.nome || user.email?.split('@')[0] || "Utente"}</h1>
                <p className="subtitle" style={{ animationDelay: '200ms' }}>Seleziona un progetto per entrare</p>

                <div className="projects-actions-bar" style={{ animationDelay: '300ms' }}>
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
                        filteredProjects.map((project, index) => {
                            const statusConfig = getStatusConfig(project.status);
                            const cardDelay = `${400 + (index * 100)}ms`;
                            return (
                                <div
                                    key={project.id}
                                    className="project-card"
                                    onClick={() => handleProjectClick(project.id)}
                                    style={{ animationDelay: cardDelay }}
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
                        <div className="no-results-box" style={{ animationDelay: '400ms', opacity: 0, animation: 'fadeInUp 0.6s forwards' }}>
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