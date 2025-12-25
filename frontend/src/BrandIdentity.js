import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, LogIn, X } from 'lucide-react';
import Footer from './Footer';
import './BrandIdentity.css';

const RevealOnScroll = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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

    const [scale, setScale] = useState(1.8);
    const [opacity, setOpacity] = useState(1);
    const [overlayOpacity, setOverlayOpacity] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [containerOpacity, setContainerOpacity] = useState(0);

    const [isSpinning, setIsSpinning] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleCopyColor = (color, colorName) => {
        navigator.clipboard.writeText(color);
        setCopied(colorName);
        setTimeout(() => setCopied(null), 2000);
    };
    const closeLightbox = () => setSelectedImage(null);

    useEffect(() => {
        const autoSpinTimer = setInterval(() => {
            setIsSpinning(prevIsSpinning => {
                if (prevIsSpinning) return true;
                return true;
            });
        }, 8000);
        return () => clearInterval(autoSpinTimer);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            if (scrollY > 100) {
                setShowNavbar(true);
            } else {
                setShowNavbar(false);
            }
            const maxScroll = 400;
            const startScale = 1.8;
            const endScale = 1.0;
            let newScale = startScale - (scrollY / maxScroll) * (startScale - endScale);
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

            const fadeStart = 0;
            const fadeEnd = 400;

            let newContainerOp = (scrollY - fadeStart) / (fadeEnd - fadeStart);

            if (newContainerOp < 0) newContainerOp = 0;
            if (newContainerOp > 1) newContainerOp = 1;

            setContainerOpacity(newContainerOp);

            const winHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (scrollY / winHeight) * 100;
            setScrollProgress(scrolled);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="brand-page">

            <header className={`brand-header ${showNavbar ? 'visible' : ''}`}>
                <div className="header-content">
                    <img src="/Logo/LogoBugBoard26.svg" alt="BugBoard Logo" className="brand-logo-small" />
                    <button className="btn-login-header" onClick={() => navigate('/')}>
                        <LogIn size={20}/> Accedi
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
                        <div className="logo-glow"></div>

                    </h1>

                    <p className="brand-subtitle animated-subtitle" style={{ opacity: opacity }}>
                        <span className="subtitle-highlight">L'essenza visiva di BugBoard26®</span>
                    </p>
                </div>
                <div className="scroll-indicator"></div>
            </div>

            <div className="brand-container" style={{ opacity: containerOpacity }}>
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
                                <img
                                    src="/Logo/LogoSpin.png"
                                    alt="Coccinella BugBoard"
                                    className={`brand-image ${isSpinning ? 'spinning-logo' : ''}`}
                                    onClick={() => setIsSpinning(true)}
                                    onAnimationEnd={() => setIsSpinning(false)}
                                    style={{ cursor: 'pointer' }}
                                />
                            </div>
                            <span className="caption">La coccinella di BugBoard®</span>
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
                    <section className="brand-section">
                        <div className="text-content">
                            <h2>Le diverse versioni del Logo</h2>
                        </div>
                        <div className="logo-grid-container">
                            <div className="logo-grid-item" onClick={() => setSelectedImage("/Logo/LogoBugBoard26.svg")}>
                                <div className="logo-wrapper">
                                    <img src="/Logo/LogoBugBoard26.svg" alt="Logo Versione Principale" className="logo-grid-img" />
                                </div>
                            </div>

                            <div className="logo-grid-item" onClick={() => setSelectedImage("/Logo/LogoBugBoard26-Orizzontale.png")}>
                                <div className="logo-wrapper">
                                    <img src="/Logo/LogoBugBoard26-Orizzontale.png" alt="Logo Versione Negativa" className="logo-grid-img"/>
                                </div>
                            </div>

                            <div className="logo-grid-item" onClick={() => setSelectedImage("/Logo/LogoBugBoard26.png")}>
                                <div className="logo-wrapper">
                                    <img src="/Logo/LogoBugBoard26.png" alt="logo" className="logo-grid-img"/>
                                </div>
                            </div>

                            <div className="logo-grid-item dark-bg" onClick={() => setSelectedImage("/Logo/LogoBugBoard26-Bianco.png")}>
                                <div className="logo-wrapper">
                                    <img src="/Logo/LogoBugBoard26-Bianco.png" alt="logo" className="logo-grid-img" />
                                </div>
                            </div>
                        </div>
                    </section>
                </RevealOnScroll>

                <RevealOnScroll>
                    <section className="brand-section split-layout reverse">
                        <div className="text-content">
                            <h2>I Colori: La Palette BugBoard</h2>
                            <p>
                                La palette cromatica è stata scelta per comunicare professionalità e modernità. <br/>
                                Il colore primario è il <span style={{color: "#002060", fontFamily: "NeueHaasGroteskDisp Pro BLk"}}>Blu BugBoard</span>, una tonalità profonda che evoca fiducia e professionalità.
                            </p>
                            <p>
                                Ad esso si affianca il <span style={{color: "#B0B0B0", fontFamily: "NeueHaasGroteskDisp Pro BLk"}}>Grigio BugBoard</span>, un colore neutro e sofisticato utilizzato per testi secondari e sfondi, che garantisce equilibrio e leggibilità.
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
                            Il font utilizzato nel logo è lo stesso dell'intera interfaccia utente: <span style={{ fontFamily: "NeueHaasGroteskDisp Pro BLk"}}>Neue Haas Grotesk Display Pro</span>.
                            Questo font garantisce un'alta leggibilità e conferisce al marchio un'idea di modernità e professionalità <span style={{fontStyle: "italic"}}>Swiss Style</span>.
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
            {selectedImage && (
                <div
                    className="lightbox-overlay"
                    onClick={closeLightbox}
                    style={{
                        backgroundColor: selectedImage.includes("Bianco")
                            ? "rgba(0,32,96,0.85)"
                            : "rgba(255, 255, 255, 0.85)"
                    }}
                >
                    <button className="lightbox-close-btn" onClick={closeLightbox}>
                        <X size={32} color={selectedImage.includes("Bianco") ? "#FFFFFF" : "#ff4d4d"} />
                    </button>

                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <img src={selectedImage} alt="Logo Ingrandito" className="lightbox-image" />
                    </div>
                </div>
            )}
        </div>
    );
}