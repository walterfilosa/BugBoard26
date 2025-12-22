import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, LogIn } from 'lucide-react';
import Footer from './Footer';
import './BrandIdentity.css';

// ... (Componente RevealOnScroll rimane uguale) ...
const RevealOnScroll = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.2 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) observer.disconnect();
        };
    }, []);

    return (
        <div ref={ref} className={`reveal-section ${isVisible ? 'is-visible' : ''}`}>
            {children}
        </div>
    );
};

export default function BrandIdentity() {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(null);
    const [showNavbar, setShowNavbar] = useState(false);

    // NUOVO STATO: Traccia la percentuale di scroll per l'effetto zoom
    const [scale, setScale] = useState(1.5);
    const [opacity, setOpacity] = useState(1);
    const [overlayOpacity, setOverlayOpacity] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);

    const handleCopyColor = (color, colorName) => {
        navigator.clipboard.writeText(color);
        setCopied(colorName);
        setTimeout(() => setCopied(null), 2000);
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            // 1. Logica Navbar (uguale a prima)
            if (scrollY > 100) {
                setShowNavbar(true);
            } else {
                setShowNavbar(false);
            }

            // 2. Logica Zoom Titolo
            // Calcoliamo un fattore di scala che va da 1.5 (grande) a 1.0 (normale)
            // L'effetto dura per i primi 400px di scroll
            const maxScroll = 400;
            const startScale = 1.8; // Grandezza iniziale
            const endScale = 1.0;   // Grandezza finale

            // Formula di interpolazione lineare
            let newScale = startScale - (scrollY / maxScroll) * (startScale - endScale);

            // Limitiamo il valore: non deve mai essere più piccolo di endScale
            if (newScale < endScale) newScale = endScale;

            setScale(newScale);

            const maxScrollFade = 200;
            let newOpacity = 1 - (scrollY / maxScrollFade);
            if (newOpacity < 0) newOpacity = 0;
            if (newOpacity > 1) newOpacity = 1;

            setOpacity(newOpacity);

            const maxScrollOverlay = 500;
            const maxOpacityValue = 0.6;

            let newOverlayOp = (scrollY / maxScrollOverlay) * maxOpacityValue;

            if (newOverlayOp > maxOpacityValue) newOverlayOp = maxOpacityValue;

            setOverlayOpacity(newOverlayOp);

            const winHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (scrollY / winHeight) * 100;

            setScrollProgress(scrolled);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="brand-page">

            <header className={`brand-header ${showNavbar ? 'visible' : ''}`}>
                <div className="header-content">
                    <img src="/Logo/LogoBugBoard26.svg" alt="BugBoard Logo" className="brand-logo-small" />
                    <button className="btn-login-header" onClick={() => navigate('/')}>
                        <LogIn size={20}/> Login
                    </button>
                </div>
                <div className="scroll-progress-container">
                    <div
                        className="scroll-progress-bar"
                        style={{ width: `${scrollProgress}%` }}
                    ></div>
                </div>
            </header>

            <div className="brand-hero" style={{backgroundImage: "url('/Logo/ImmagineNapoli.jpg')"}}>
                <div className="hero-overlay" style={{ backgroundColor: `rgba(0, 32, 96, ${overlayOpacity})` }}></div>
                <div className="hero-content">
                    <h1
                        className="brand-title animated-title"
                        style={{ transform: `scale(${scale})` }}
                    >
                        <span className="title-word">Brand</span>
                        <span className="title-word">Identity</span>
                    </h1>

                    <p className="brand-subtitle animated-subtitle" style={{ opacity: opacity }}>
                        L'essenza visiva di BugBoard26®
                    </p>
                </div>
                <div className="scroll-indicator"></div>
            </div>

            {/* ... Resto del contenuto (Brand Container, etc.) rimane identico ... */}
            <div className="brand-container">
                {/* ... (Codice esistente delle sezioni) ... */}
                <RevealOnScroll>
                    <section className="brand-section">
                        <div className="text-content">
                            <h2>Strategia Visiva</h2>
                            <p>
                                Al fine di garantire un immediato riconoscimento del marchio <strong>BugBoard26®</strong> da parte di tutti, si è deciso di adottare una vera e propria strategia di Visual Identity.
                            </p>
                            <p>
                                Lo scopo perseguito era comunicare l’essenza del marchio tramite una combinazione di elementi grafici, in modo da creare un’immediata connessione tra il marchio e l’utente.
                            </p>
                        </div>
                    </section>
                </RevealOnScroll>

                <RevealOnScroll>
                    <section className="brand-section split-layout">
                        <div className="text-content">
                            <h2>Il Logo: Perché una Coccinella?</h2>
                            <p>
                                BugBoard26® è una piattaforma per la gestione di issue. Tra i vari tipi di issue, i <strong>bug</strong> (malfunzionamenti) sono i più frequenti.
                                Il termine inglese <em>bug</em> significa letteralmente "insetto".
                            </p>
                            <p>
                                Dopo un’attenta analisi, si è scelto come simbolo una <strong>coccinella</strong>. Non è una scelta casuale:
                                la coccinella è simbolo universale di <strong>fortuna e buon auspicio</strong>, di cui gli sviluppatori hanno bisogno.
                                Inoltre, in natura la coccinella è un insetto "benefico" che distrugge i parassiti; analogamente, <strong>BugBoard26® distrugge i bug del software</strong>.
                            </p>
                        </div>
                        <div className="visual-content centered">
                            <div className="image-showcase floating">
                                <img src="/Logo/LogoSpin.png" alt="Vista di Napoli con Vesuvio" className="brand-image" />
                            </div>
                            <span className="caption">La coccinella di BugBoard</span>
                        </div>
                    </section>
                </RevealOnScroll>

                <RevealOnScroll>
                    <section className="brand-section">
                        <h2>Analisi del Logo</h2>
                        <div className="anatomy-grid">
                            <div className="anatomy-item">
                                <div className="circle-blue"></div>
                                <p><strong>Il Corpo</strong><br/>Un cerchio blu solido che rappresenta il corpo dell'insetto.</p>
                            </div>
                            <div className="anatomy-item">
                                <img src="/Logo/LogoSpin.png" className="big-letter" alt="Logo"></img>
                                <p><strong>Le Zampe</strong><br/>Le due "B" (Bug & Board) partono dall'interno verso l'esterno, riproducendo le sei zampe.</p>
                            </div>
                        </div>
                    </section>
                </RevealOnScroll>

                <RevealOnScroll>
                    <section className="brand-section split-layout reverse">
                        <div className="text-content">
                            <h2>I Colori: La Palette BugBoard</h2>
                            <p>
                                La palette cromatica è stata scelta per comunicare professionalità e modernità.
                                Il colore primario è il <strong style={{color: "#002060"}}>Blu BugBoard</strong>, una tonalità profonda che evoca fiducia e tecnologia.
                            </p>
                            <p>
                                Ad esso si affianca il <strong style={{color: "#B0B0B0"}}>Grigio BugBoard</strong>, un colore neutro e sofisticato utilizzato per testi secondari e sfondi, che garantisce equilibrio e leggibilità.
                            </p>
                        </div>
                        <div className="visual-content centered color-visual-content">
                            <div className="colors-grid">
                                <div className="color-card primary" onClick={() => handleCopyColor("#002060", "blu")}>
                                    <div className="color-swatch" style={{backgroundColor: "#002060"}}></div>
                                    <div className="color-info">
                                        <span className="color-name">Blu BugBoard</span>
                                        <span className="color-hex">#002060</span>
                                        <span className="copy-hint">
                                            {copied === "blu" ? <><Check size={14}/> Copiato!</> : <><Copy size={14}/> Clicca per copiare</>}
                                        </span>
                                    </div>
                                </div>
                                <div className="color-card secondary" onClick={() => handleCopyColor("#B0B0B0", "grigio")}>
                                    <div className="color-swatch" style={{backgroundColor: "#B0B0B0"}}></div>
                                    <div className="color-info">
                                        <span className="color-name">Grigio BugBoard</span>
                                        <span className="color-hex">#B0B0B0</span>
                                        <span className="copy-hint">
                                            {copied === "grigio" ? <><Check size={14}/> Copiato!</> : <><Copy size={14}/> Clicca per copiare</>}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </RevealOnScroll>

                <RevealOnScroll>
                    <section className="brand-section">
                        <h2>Tipografia</h2>
                        <p>
                            Il font utilizzato nel logo è lo stesso dell'intera interfaccia utente: <strong>Neue Haas Grotesk Display Pro</strong>.
                            Questo font garantisce un'alta leggibilità e conferisce al marchio un'idea di modernità e professionalità "Swiss Style".
                        </p>

                        <div className="typography-showcase">
                            <div className="font-demo medium">
                                <span className="font-weight-label">Medium</span>
                                <span className="font-sample">BugBoard26®</span>
                                <span className="font-alphabet">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 1234567890</span>
                            </div>
                            <div className="font-demo bold">
                                <span className="font-weight-label">Bold</span>
                                <span className="font-sample">BugBoard26®</span>
                                <span className="font-alphabet">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 1234567890</span>
                            </div>
                        </div>
                    </section>
                </RevealOnScroll>
            </div>
            <Footer />
        </div>
    );
}