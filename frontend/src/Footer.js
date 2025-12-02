import React from 'react';
import './Footer.css';
import {FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaTelegram} from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="app-footer">
            <div className="footer-left">
                <p className="nomeSocietà">SoftEngUnina</p>
                <div className="note-copyright">
                    <p>© 2025. Tutti i diritti riservati.</p>
                    <p>È vietata la copia parziale e/o totale dei contenuti presenti nel sito.<br/>I trasgressori saranno perseguiti a norma di legge.</p>
                </div>
            </div>
            <div className="footer-right">
                <p className="contatti-footer">
                    Contatti
                </p>
                <p>
                    <a href="https://maps.app.goo.gl/YpnMAD44Vvqr3b6v9" className="footer-link">Via Claudio, 21 - 80125 Napoli (NA)</a>
                    <br/>
                    <a href="tel://0812531111" className="footer-link">(+39) 081 253 1111</a>
                </p>

                <div className="social">
                    <p className="seguici">
                        Seguici su:
                    </p>
                    <div className="social-icons">
                        <a href="https://www.instagram.com/uninait" target="_blank" rel="noopener noreferrer"><FaInstagram/></a>
                        <a href="https://www.facebook.com/unina.it" target="_blank" rel="noopener noreferrer"><FaFacebook/></a>
                        <a href="https://twitter.com/uninait" target="_blank" rel="noopener noreferrer"><FaTwitter/></a>
                        <a href="https://www.linkedin.com/school/unina/" target="_blank" rel="noopener noreferrer"><FaLinkedin/></a>
                        <a href="https://t.me/informatica_unina" target="_blank" rel="noopener noreferrer"><FaTelegram/></a>
                    </div>
                </div>
            </div>
        </footer>
    )
}