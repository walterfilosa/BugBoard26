import {NavLink, useNavigate} from 'react-router-dom'
import './NavbarUtente.css';
import {useState} from "react";
import {FaUserCircle, FaChevronDown, FaSignOutAlt, FaUser} from 'react-icons/fa';

function ProfileMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        console.log("Utente disconnesso");

        navigate('/');
    }
    return (
        <div className="profile-wrapper">
            <div className="info-utente">
                <p className="testo-utente">Benvenuto,</p>
                <p className="nome-utente">Gennaro</p>
            </div>
            <div className="profile-menu-container">
                <div className="profile-button" onClick={toggleMenu}>
                    <FaUserCircle className="profile-icon" />
                    <FaChevronDown className="chevron-icon" />
                </div>

                {isOpen && (
                    <div className="dropdown-menu">
                        <a href="/profilo" className="menu-item"><FaUser/>Profilo</a>
                        <a href="/" className="menu-item link-logout"><FaSignOutAlt/>Esci</a>
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
                <NavLink to={"/gestisci-issue"} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Gestisci issue</NavLink>
                <NavLink to={"/users"} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Gestisci utenze</NavLink>
                <NavLink to={"/admin/segnala-issue"} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Segnala issue</NavLink>
            </div>
            <div className="navbar-right">
                <ProfileMenu/>
            </div>
        </nav>
    )
}