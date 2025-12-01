import {NavLink} from 'react-router-dom'
import './NavbarUtente.css';
import {useState} from "react";
import { FaUserCircle, FaChevronDown } from 'react-icons/fa';

function ProfileMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    return (
        <div>
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
                        <a href="/profilo">Profilo</a>
                        <a href="/logout">Logout</a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function NavbarUtente() {


    return (
        <nav className = "navbar">
            <div className="navbar-left">
                <img src="/Logo/LogoBugBoard26.svg" alt="logo" className="logo"/>
                <div className="navbar-center">
                    <NavLink to={"/VisualizzaIssue"} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Visualizza issue</NavLink>
                    <NavLink to={"/SegnalaIssue"} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Segnala issue</NavLink>
                </div>

                <ProfileMenu/>
            </div>
        </nav>
    )
}