import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import './About.css';
import { LogIn, Mail } from 'lucide-react';
import Footer from "./Footer";

export default function About() {
    const navigate = useNavigate();
    const [showSplash, setShowSplash] = useState(true);
    const [activeSection, setActiveSection] = useState(null);

    const [cursorTop, setCursorTop] = useState(0);

    const sectionRefs = useRef({});

    const sidebarItemRefs = useRef({});

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 3500);

        return () => clearTimeout(timer);
    }, []);


    useEffect(() => {
        if (showSplash) return;

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -50% 0px',
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        Object.values(sectionRefs.current).forEach((section) => {
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, [showSplash]);

    useEffect(() => {
        if (activeSection && sidebarItemRefs.current[activeSection]) {
            const activeLi = sidebarItemRefs.current[activeSection];
            let newTop = activeLi.offsetTop + (activeLi.offsetHeight / 2);

            newTop = newTop - 15;

            setCursorTop(newTop);
        } else if (sections.length > 0 && sidebarItemRefs.current[sections[0].id]) {
            const firstLi = sidebarItemRefs.current[sections[0].id];
            let newTop = firstLi.offsetTop + (firstLi.offsetHeight / 2) - 15;
            setCursorTop(newTop);
        }
    }, [activeSection]);


    const scrollToSection = (sectionId) => {
        const section = sectionRefs.current[sectionId];
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const sections = [
        { id: 'intro', title: 'Cos\'è BugBoard' },
        { id: 'mission', title: 'La nostra Mission' },
        { id: 'features', title: 'Funzionalità Chiave' },
        { id: 'project', title: 'Il Progetto' },
        { id: 'brand-identity', title: 'Brand Identity' },
        { id: 'team', title: 'Il Team' },
        { id: 'contatti', title: 'Contatti'}
    ];


    return (
        <>
            <div className="about-splash-container">
                <div className="splash-text-container">
                    <div className="splash-fade-in">
                        <span>Ab</span>
                        <img
                            src="/Logo/LogoSpin.png"
                            alt="o"
                            className="splash-rotating-logo"
                        />
                        <span>ut</span>
                    </div>
                </div>
            </div>

            <div className="about-page-container">
                <header className="about-header">
                    <img src="/Logo/LogoBugBoard26.svg" alt="BugBoard Logo" className="about-header-logo"/>
                    <button className="btn-login-header" onClick={() => navigate('/')}>
                        <LogIn size={20}/> Accedi
                    </button>
                </header>

                <div className="about-content-wrapper">
                    <aside className="about-sidebar">
                        <div className="timeline-container">
                            <div className="timeline-line"></div>
                            <img
                                src="/Logo/LogoSpin.png"
                                alt="Timeline Cursor"
                                className="timeline-cursor-logo"
                                style={{ top: `${cursorTop}px` }}
                            />

                            <ul className="timeline-list">
                                {sections.map((section) => (
                                    <li
                                        key={section.id}
                                        ref={el => sidebarItemRefs.current[section.id] = el}
                                        className={activeSection === section.id ? 'active' : ''}
                                    >
                                    <span
                                        className="sidebar-link"
                                        onClick={() => scrollToSection(section.id)}
                                    >
                                        {section.title}
                                    </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    <main className="about-main-text">
                        <div className="title-box">
                            <h1 className="main-title">
                                Ab
                            </h1>
                            <img src="/Logo/LogoSpin.png" style={{width: "65px", height: "auto", marginTop: "25px"}}/>
                            <h1 className="main-title">
                                ut Us
                            </h1>
                        </div>

                        <section id="intro" className="content-section" ref={el => sectionRefs.current['intro'] = el}>
                            <h2>Cos'è BugBoard</h2>
                            <p>
                                <span className="interactive-logo-container">

                                    <span className="testo-evidenza placeholder-text">BugBoard26®</span>
                                    <span className="testo-evidenza revealed-text">BugBoard26®</span>
                                <img
                                    src="/Logo/LogoSpin.png"
                                    alt="walking bug"
                                    className="hover-walking-logo"
                                />
                                </span> è una piattaforma per la gestione collaborativa di issue in progetti software. Il sistema consente a team di sviluppo di segnalare problemi relativi a un progetto, monitorarne lo stato, assegnarli a membri del team e tenere traccia delle attività di risoluzione. Il sistema consiste in un’applicazione web-based, attraverso cui gli utenti possono fruire delle funzionalità in modo intuitivo e rapido.
                            </p>
                        </section>
                        <section id="mission" className="content-section" ref={el => sectionRefs.current['mission'] = el}>
                            <h2>La nostra Mission</h2>
                            <p>
                                La nostra missione è rendere più facile la gestione delle issue da parte degli sviluppatori e degli amministratori all'interno di un team.
                                <br/>Pertanto, abbiamo realizzato un'applicazione che permette agli sviluppatoti di segnalare
                                issue in maniera rapida e agli amministratori di gestirle e assegnarle con pochi click.
                            </p>
                        </section>
                        <section id="features" className="content-section" ref={el => sectionRefs.current['features'] = el}>
                            <h2>Funzionalità Chiave</h2>
                            <p>
                                BugBoard si concentra sulla velocità e l'usabilità. Le nostre funzionalità principali includono
                                una dashboard intuitiva, un sistema di filtraggio avanzato per le issue, e la gestione dei ruoli utente.
                            </p>
                            <p>
                                Abbiamo progettato ogni interazione per richiedere il minor numero di click possibile,
                                permettendoti di concentrarti sul codice, non sulla gestione dello strumento.
                            </p>
                        </section>
                        <section id="project" className="content-section" ref={el => sectionRefs.current['project'] = el}>
                            <h2>Il Progetto</h2>
                            <p>
                                BugBoard26 è un progetto universitario, propedeutico all'insegnamento di Ingegneria del Software.
                                La sua realizzazione è stata possibile pertanto grazie all'<Link to={"https://www.unina.it"} className={"link-pulito"}>Università degli Studi di Napoli Federico II</Link>,
                                in particolare al <Link to={"https://www.dieti.unina.it"} className={"link-pulito"}>DIETI</Link> (Dipartimento di Ingegneria Elettrica e Tecnologie dell'Informazione) e al
                                <Link to={"https://www.informatica.dieti.unina.it"} className={"link-pulito"}> Corso di Studi in Informatica</Link>, coordinato dal <Link to={"https://www.docenti.unina.it/sergio.dimartino"} className={"link-pulito"}>Prof. Sergio Di Martino</Link>.
                            </p>
                            <div className="project-images-container">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/it/a/a5/Federico_II_University_Logo.svg"
                                    alt="Descrizione immagine 1"
                                    className="project-image"
                                />
                                <img
                                    src="http://wpage.unina.it/stavallo/images/logo_dieti.png"
                                    alt="Descrizione immagine 2"
                                    className="project-image"
                                />
                            </div>
                        </section>
                        <section id="brand-identity" className="content-section" ref={el => sectionRefs.current['brand-identity'] = el}>
                            <h2>
                                Brand Identity
                            </h2>

                            <p>
                                Al fine di garantire un immediato riconoscimento del marchio BugBoard26® da parte di tutti, si è deciso di adottare una vera e propria strategia di Visual Identity.

                                Volevamo comunicare l’essenza del marchio tramite una combinazione di elementi grafici, in modo da creare un’immediata connessione tra il marchio e l’utente.
                            </p>
                            <p>
                                Scopri di più sulla nostra brand identity alla <Link to="/brand-identity" className="link-pulito">pagina dedicata</Link>.
                            </p>
                            <img src="/Logo/LogoBugBoard26.svg" style={{width: "50%"}}/>
                        </section>
                        <section id="team" className="content-section" ref={el => sectionRefs.current['team'] = el}>
                            <h2>Il Team</h2>
                            <p>
                                Siamo un team formato da due giovani sviluppatori studenti del Corso di Studi Triennale di Informatica presso l'<Link to={"https://www.unina.it"} className={"link-pulito"}> Università degli Studi di Napoli "Federico II"</Link>.<br/>
                            </p>
                            <p style={{paddingLeft: "40px"}}>
                                <span className="testo-evidenza">Vincenzo Donadio</span><br/>
                                Vincenzo ha apportato un impatto significativo nella realizzazione del cuore dell'applicazione, il back-end.
                                Grazie al suo ampio background di conoscenze in ambito Java Spring Boot, ha saputo abilmente gestire questa parte.
                                <br/><span className="testo-evidenza">Walter Filosa</span><br/>
                                Walter, invece, si è concentrato sulla realizzazione del front-end  di BugBoard. Dopo un attenta analisi del marchio,
                                e dopo aver realizzato una Brand Identity capace di dare
                            </p>
                            <p>
                                Un ringraziamento particolare va ai nostri docenti, il <Link to="https://www.docenti.unina.it/sergio.dimartino" className={"link-pulito"}>Prof. Sergio Di Martino</Link> e il <Link to="https://www.docenti.unina.it/luigiliberolucio.starace" className={"link-pulito"}>Prof. Luigi Libero Lucio Starace</Link>.

                            </p>
                        </section>
                        <section id="contatti" className="content-section" ref={el => sectionRefs.current['contatti'] = el}>
                            <h2>Contatti</h2>
                            <div className={"testo-evidenza"} style={{fontSize: "16pt", marginBottom: "8px"}}>
                                Autori:
                            </div>
                            <div className="table-container">
                                <table className="custom-table">
                                    <tbody>
                                    <tr>
                                        <td className="testo-blu" style={{width: "40%"}}>Vincenzo Donadio</td>
                                        <td><Link to="mailto:vin.donadio@studenti.unina.it" className="link-pulito-grigio">vin.donadio@studenti.unina.it</Link></td>
                                    </tr>
                                    <tr>
                                        <td className="testo-blu">Walter Filosa</td>
                                        <td><Link to="mailto:w.filosa@studenti.unina.it" className="link-pulito-grigio">w.filosa@studenti.unina.it</Link></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className={"testo-evidenza"} style={{fontSize: "16pt", marginBottom: "8px"}}>
                                Docenti:
                            </div>
                            <div className="table-container">
                                <table className="custom-table">
                                    <tbody>
                                    <tr>
                                        <td className="testo-blu" style={{width: "40%"}}>Prof. Sergio Di Martino</td>
                                        <td><Link to="mailto:sergio.dimartino@unina.it" className="link-pulito-grigio" style={{width: "25%"}}>sergio.dimartino@unina.it</Link></td>
                                        <td><Link to="tel:081679272" className="link-pulito-grigio">+39 081 679 272</Link></td>
                                    </tr>
                                    <tr>
                                        <td className="testo-blu">Prof. Luigi Libero Lucio Starace</td>
                                        <td><Link to="mailto:luigiliberolucio.starace@unina.it" className="link-pulito-grigio">luigiliberolucio.starace@unina.it</Link></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                        <section>
                            <hr/>
                            <p>
                                Gli Autori
                            </p>
                        </section>


                    </main>
                </div>
            </div>
            <Footer/>
        </>
    );
}