import './SegnalaIssue.css';
import './NavbarUtente.js';
import NavbarUtente from "./NavbarUtente";
import Footer from "./Footer";

export default function SegnalaIssue() {
    return (
        <div className="segnalaissue">
            <NavbarUtente></NavbarUtente>
            <div className="homepage-container">
                <h1>Segnala issue</h1>
            </div>
            <Footer/>
        </div>
    )
}