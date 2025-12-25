import {NavLink, useNavigate} from 'react-router-dom'
import './NavbarUtente.css';
import {useState} from "react";
import { FaUserCircle } from 'react-icons/fa';
import { User2, ChevronDown, LogOut, FolderX} from "lucide-react";
import { useAuth } from "./context/AuthContext";

function ProfileMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const { user } = useAuth();

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('currentProjectId');

        console.log("Utente disconnesso");

        navigate('/');
    }

    const handleCloseProject = (e) => {
        e.preventDefault();
        localStorage.removeItem('currentProjectId');
        navigate('/progetti');
    }

    if (!user) return null;

    const userInitial = user?.nome ? user.nome.charAt(0).toUpperCase() : 'A';

    return (
        <div className="profile-wrapper">
            <div className="info-utente">
                <p className="testo-utente">Benvenuto,</p>
                <p className="nome-utente">{user?.nome}</p>
            </div>
            <div className="profile-menu-container">
                <div className="profile-button" onClick={toggleMenu}>
                    <FaUserCircle className="profile-icon" />
                    <ChevronDown className="chevron-icon" />
                </div>

                {isOpen && (
                    <div className="dropdown-menu">
                        <NavLink to="/admin/profilo" className="menu-item"><User2/>Profilo</NavLink>
                        <NavLink to="/progetti" className="menu-item" onClick={handleCloseProject}>
                            <FolderX size={20}/> Chiudi Progetto
                        </NavLink>
                        <NavLink to="/" className="menu-item link-logout" onClick={handleLogout}><LogOut/>Esci</NavLink>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function NavbarAmministratore() {
    return (
        <nav className = "navbar">
            <div className="navbar-left">
                <img src="/Logo/LogoBugBoard26.svg" alt="logo" className="logo"/>
            </div>
            <div className="navbar-center">
                <NavLink to={"/admin/home"} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Gestisci Issue</NavLink>
                <NavLink to={"/admin/gestione-utenze"} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Gestisci Utenze</NavLink>
                <NavLink to={"/admin/segnala-issue"} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Segnala Issue</NavLink>
            </div>
            <div className="navbar-right">
                <ProfileMenu/>
            </div>
        </nav>
    )
}