import React, {useState, useEffect} from 'react';
import './Profilo.css';
import { useNavigate } from 'react-router-dom';
import {CircleCheck, Edit2, Save, ShieldCheck, X, EyeOff, Eye, CircleAlert, Lock, ArrowLeft} from 'lucide-react';
import PrefixMenu from './PrefixMenu';
import { useAuth } from './context/AuthContext';
import { getUserById, updateUser, verifyUserPassword, loginAPI } from './services/api';
import LoadingSpinner from './LoadingSpinner';
import './BrandIdentity.css';
import Footer from './Footer';

const splitPhoneNumber = (fullNumber, list) => {
    if (!fullNumber) return {prefisso: "+39", telefono: ""};
    if (!list || list.length === 0) {
        if(fullNumber.startsWith("+39")) return { prefisso: "+39", telefono: fullNumber.replace("+39", "") };
        return {prefisso: "+39", telefono: fullNumber};
    }
    const match = list.find(p => fullNumber.startsWith(p.code));
    if (match) {
        return { prefisso: match.code, telefono: fullNumber.replace(match.code, "") };
    }
    return {prefisso: "+39", telefono: fullNumber};
};

export function Profilo({ isStandalone = false }) {

    const navigate = useNavigate();

    const { user, isAdmin } = useAuth();

    const [showNavbar, setShowNavbar] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const [showSuccess, setShowSuccess] = useState(false);
    const [showPasswordError, setShowPasswordError] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
    const [modalError, setModalError] = useState(null);

    const [userData, setUserData] = useState({
        id: "",
        nome: "",
        cognome: "",
        dataNascita: "",
        email: "",
        vecchiaPassword: "",
        nuovaPassword: "",
        telefono: ""
    });

    const [originalData, setOriginalData] = useState(null);

    const [prefissiList, setPrefissiList] = useState([]);
    const [loadingPrefixes, setLoadingPrefixes] = useState(true);

    useEffect(() => {
        if (!isStandalone) return;

        const handleScroll = () => {
            const scrollY = window.scrollY;

            const winHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (scrollY / winHeight) * 100;
            setScrollProgress(scrolled);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isStandalone]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user || !user.id) return;

            try {
                setLoading(true);
                const data = await getUserById(user.id);

                if (data.dataNascita) {
                    const d = new Date(data.dataNascita);
                    if (!isNaN(d.getTime())) {
                        const year = d.getFullYear();
                        const month = String(d.getMonth() + 1).padStart(2, '0');
                        const day = String(d.getDate()).padStart(2, '0');
                        data.dataNascita = `${year}-${month}-${day}`;
                    }
                }

                const phoneSplit = splitPhoneNumber(data.telefono, prefissiList);

                setUserData(prev => ({
                    ...prev,
                    ...data,
                    prefisso: phoneSplit.prefisso,
                    telefono: phoneSplit.telefono
                }));

            } catch (err) {
                console.error(err);
                setError("Impossibile caricare il profilo.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user, prefissiList]);

    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('https://restcountries.com/v3.1/all?fields=idd,cca2,name');
                const data = await response.json();

                const formattedList = data
                    .filter(country => country.idd && country.idd.root)
                    .map(country => {
                        const root = country.idd.root;
                        const suffix = country.idd.suffixes && country.idd.suffixes.length === 1 ? country.idd.suffixes[0] : "";
                        return {
                            code: `${root}${suffix}`,
                            country: country.cca2,
                            iso: country.cca2.toLowerCase(),
                            name: country.name.common
                        };
                    })
                    .sort((a, b) => {
                        const numA = parseInt(a.code.replace('+', ''));
                        const numB = parseInt(b.code.replace('+', ''));
                        if (numA !== numB) return numA - numB;
                        return a.name.localeCompare(b.name);
                    });

                const italy = formattedList.find(c => c.iso === 'it');
                const others = formattedList.filter(c => c.iso !== 'it');
                const finalList = italy ? [italy, ...others] : formattedList;

                setPrefissiList(finalList);
                setLoadingPrefixes(false);

            } catch (error) {
                console.error("Errore caricamento prefissi:", error);
                setPrefissiList([{ code: "+39", country: "IT", iso: "it", name: "Italy" }]);
                setLoadingPrefixes(false);
            }
        };

        fetchCountries();
    }, []);

    const handleStartEdit = () => {
        setOriginalData({...userData});
        setUserData(prev => ({...prev, vecchiaPassword: "", nuovaPassword: ""}))
        setIsEditing(true);
    };

    const handleCancel = () => {
        setUserData(originalData);
        setOriginalData(null);
        setIsEditing(false);
        setShowPassword(false);
        setShowPasswordError(false);
    };

    const handleChange = (e) => {
        const {name, value} = e.target;

        if (name === "telefono") {
            const isNumeric = /^\d*$/.test(value);

            if (isNumeric && value.length <= 11) {
                setUserData(prev => ({
                    ...prev,
                    [name]: value
                }));
            }
        } else {
            setUserData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSaveClick = () => {
        const emailChanged = originalData && userData.email !== originalData.email;
        const passwordChanged = userData.nuovaPassword && userData.nuovaPassword.trim() !== "";
        if (emailChanged || passwordChanged) {
            if (!userData.vecchiaPassword || userData.vecchiaPassword.trim() === "") {
                setConfirmPasswordInput("");
                setModalError(null);
                setShowConfirmModal(true);
                return;
            }
            performUpdate(userData.vecchiaPassword);
        } else {
            performUpdate(null);
        }
    };

    const handleModalConfirm = () => {
        if (!confirmPasswordInput) {
            setModalError("Inserisci la password per continuare.");
            return;
        }
        performUpdate(confirmPasswordInput);
    };

    const performUpdate = async (passwordForVerification) => {
        setIsSaving(true);
        setModalError(null);

        const emailChanged = originalData && userData.email !== originalData.email;
        const passwordChanged = userData.nuovaPassword && userData.nuovaPassword.trim() !== "";
        const numeroCompleto = `${userData.prefisso}${userData.telefono}`;

        try {
            if (emailChanged || passwordChanged) {
                const isCorrect = await verifyUserPassword(user.id, passwordForVerification);
                if (!isCorrect) {
                    const msg = "La password inserita non è corretta.";
                    if (showConfirmModal) setModalError(msg);
                    else {
                        setModalError(msg);
                        setShowConfirmModal(true);
                    }
                    setIsSaving(false);
                    return;
                }
            }

            const payload = {
                idUtente: user.id,
                nome: userData.nome,
                cognome: userData.cognome,
                dataNascita: userData.dataNascita,
                email: userData.email,
                numeroTelefono: numeroCompleto
            };

            if (passwordChanged) {
                payload.password = userData.nuovaPassword;
            }

            await updateUser(payload);

            if (emailChanged || passwordChanged) {
                console.log("Credenziali cambiate: Eseguo ri-login automatico...");
                const loginPwd = passwordChanged ? userData.nuovaPassword : passwordForVerification;

                const loginResponse = await loginAPI(userData.email, loginPwd);

                if (loginResponse && loginResponse.accessToken) {
                    localStorage.setItem("token", loginResponse.accessToken);
                    console.log("Sessione rigenerata con successo.");
                }
            }

            localStorage.setItem("userEmail", userData.email);
            if (userData.nuovaPassword) {
                setUserData(prev => ({...prev, password: prev.nuovaPassword}));
            }

            setShowSuccess(true);
            setIsEditing(false);
            setOriginalData(null);
            setShowPassword(false);
            setShowConfirmModal(false);
            setUserData(prev => ({...prev, vecchiaPassword: "", nuovaPassword: ""}));

        } catch (err) {
            console.error(err);
            if (showConfirmModal) setModalError("Errore: " + err.message);
            else alert("Errore durante il salvataggio: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <LoadingSpinner message="Caricamento profilo..." />;

    if (error) return <div style={{padding:40, textAlign:'center', color:'red'}}>{error}</div>;

    const ProfileContent = () => (
        <div className="homepage-container">

            {showConfirmModal && (
                <div className="overlay-password-confirm" style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div className="password-card" style={{
                        backgroundColor: 'white', padding: '30px', borderRadius: '12px',
                        width: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', textAlign: 'center'
                    }}>
                        <div style={{ marginBottom: 20 }}>
                            <div style={{
                                width: 60, height: 60, borderRadius: '50%', backgroundColor: '#e3f2fd',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px'
                            }}>
                                <Lock size={32} color="#1976d2" />
                            </div>
                            <h2>Conferma Modifiche</h2>
                            <p style={{ color: '#666', fontSize: '0.95rem' }}>
                                Per motivi di sicurezza, inserisci la tua <strong>password attuale</strong> per confermare il cambio di email o password.
                            </p>
                        </div>

                        <div className="floating-label-group" style={{ marginBottom: 20, textAlign: 'left' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="campo"
                                autoFocus
                                value={confirmPasswordInput}
                                onChange={(e) => {
                                    setConfirmPasswordInput(e.target.value);
                                    setModalError(null);
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && handleModalConfirm()}
                                placeholder=" "
                            />
                            <label className="floating-label">Password Attuale</label>
                            <button
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{right: 10}}
                            >
                                {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                            </button>
                        </div>

                        {modalError && (
                            <div style={{
                                color: '#d32f2f', backgroundColor: '#ffebee',
                                padding: '10px', borderRadius: '6px', fontSize: '0.9rem',
                                marginBottom: '20px', display: 'flex', alignItems: 'center', gap: 8
                            }}>
                                <CircleAlert size={16}/> {modalError}
                            </div>
                        )}

                        <div className="overlay-buttons" style={{ display: 'flex', gap: 10 }}>
                            <button
                                className="btn-cancel-create"
                                style={{flex: 1, justifyContent:'center'}}
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    setModalError(null);
                                    setIsSaving(false);
                                }}
                            >
                                Annulla
                            </button>
                            <button
                                className="btn-save-create"
                                style={{flex: 1, justifyContent:'center'}}
                                onClick={handleModalConfirm}
                                disabled={isSaving}
                            >
                                {isSaving ? "Verifica..." : "Conferma"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSuccess && (
                <div className="success-overlay">
                    <div className="success-card">
                        <CircleCheck size={64} className="success-icon"/>
                        <h2>Fatto!</h2>
                        <p>Le modifiche sono state salvate con successo.</p>

                        <button
                            className="btn-close-success"
                            onClick={() => {
                                setShowSuccess(false);
                            }}
                        >
                            Chiudi
                        </button>
                    </div>
                </div>
            )}

            {showPasswordError && (
                <div className="error-overlay">
                    <div className="error-card">
                        <CircleAlert size={64} className="error-icon-modal"/>
                        <h2>Attenzione</h2>
                        <p>La <strong>Vecchia Password</strong> inserita non è corretta.</p>
                        <p className="sub-error-text">Verifica e riprova per confermare le modifiche.</p>
                        <button className="btn-close-error" onClick={() => setShowPasswordError(false)}>
                            Riprova
                        </button>
                    </div>
                </div>
            )}

            <div className="profile-header-row">
                <div className="profile-header">
                    <h1>Il mio Profilo</h1>
                    <p>Gestisci le tue informazioni personali e di contatto</p>
                </div>

                {isAdmin && (
                    <div className="admin-badge">
                        <ShieldCheck size={20}/>
                        <span>Amministratore</span>
                    </div>
                )}
            </div>


            <h3 className="section-title">Dati Personali <span
                className="read-only-tag">(Non modificabili)</span></h3>

            <div className="form-grid">
                <div className="floating-label-group disabled-group">
                    <input
                        type="text"
                        value={userData.nome}
                        className="campo disabled-input"
                        disabled
                    />
                    <label className="floating-label">Nome</label>
                </div>

                <div className="floating-label-group disabled-group">
                    <input
                        type="text"
                        value={userData.cognome}
                        className="campo disabled-input"
                        disabled
                    />
                    <label className="floating-label">Cognome</label>
                </div>

                <div className="floating-label-group disabled-group">
                    <input
                        type="date"
                        value={userData.dataNascita}
                        className="campo disabled-input"
                        disabled
                    />
                    <label className="floating-label">Data di Nascita</label>
                </div>
            </div>

            <hr className="divider"/>

            <div className="section-header-editable">
                <h3 className="section-title">Contatti<span
                    className="editable-tag">(Modificabili)</span>
                    {isEditing && <span className="read-only-tag">(In modifica)</span>}

                </h3>
                {!isEditing ? (
                    <button className="btnSalva" onClick={handleStartEdit}>
                        <Edit2 size={16}/> Modifica
                    </button>
                ) : (
                    <div className="buttons-group">
                        <button className="btn-save-contact" onClick={handleSaveClick}>
                            <Save size={16}/> Salva
                        </button>
                        <button className="btn-cancel-contact" onClick={handleCancel}>
                            <X size={16}/> Annulla
                        </button>
                    </div>
                )}
            </div>

            <div className="form-grid">
                <div className="phone-row-container">

                    <PrefixMenu
                        selectedPrefix={userData.prefisso}
                        onSelect={(code) => setUserData({...userData, prefisso: code})}
                        disabled={!isEditing}
                    />
                    <div className={`floating-label-group ${!isEditing ? "disabled-group" : ""}`}>
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={11}
                            name="telefono"
                            value={userData.telefono}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`campo ${!isEditing ? "disabled-input" : ""}`}
                            placeholder=" "
                        />
                        <label className="floating-label">Numero di Telefono</label>
                    </div>
                </div>

                <div className={`floating-label-group ${!isEditing ? "disabled-group" : ""}`}>
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`campo ${!isEditing ? "disabled-input" : ""}`}
                        placeholder=" "
                    />
                    <label className="floating-label">Email</label>
                </div>

                {!isEditing ? (
                    <div className="floating-label-group disabled-group">
                        <input
                            type="password"
                            value="********"
                            className="campo disabled-input"
                            disabled
                            placeholder=" "
                        />
                        <label className="floating-label">Password</label>
                    </div>
                ) : (
                    <>
                        <div className="floating-label-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="vecchiaPassword"
                                value={userData.vecchiaPassword}
                                onChange={handleChange}
                                className="campo"
                                placeholder=" "
                            />
                            <label className="floating-label">Vecchia Password</label>
                            <button className="password-toggle-btn" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                            </button>
                        </div>

                        <div className="floating-label-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="nuovaPassword"
                                value={userData.nuovaPassword}
                                onChange={handleChange}
                                className="campo"
                                placeholder=" "
                            />
                            <label className="floating-label">Nuova Password</label>
                        </div>
                    </>
                )}
            </div>
        </div>
    );

    if (isStandalone) {
        return (
            <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>

                <header className={`brand-header ${showNavbar ? 'visible' : ''}`}>
                    <div className="header-content">
                        <img src="/Logo/LogoBugBoard26.svg" alt="BugBoard Logo" className="brand-logo-small"/>
                        <button className="btn-login-header" onClick={() => navigate('/progetti')}>
                            <ArrowLeft size={20}/> Torna ai Progetti
                        </button>
                    </div>
                </header>

                <div style={{flex: 1}}>
                    <ProfileContent />
                </div>

                <Footer />
            </div>
        );
    }

    return <ProfileContent/>;
}