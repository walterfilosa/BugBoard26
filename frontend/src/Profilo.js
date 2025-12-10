import React, {useState, useEffect} from 'react';
import './Profilo.css';
import {CircleCheck, Edit2, Save, ShieldCheck, X, EyeOff, Eye} from 'lucide-react';
import PrefixMenu from './PrefixMenu';

export function Profilo() {

    const [showSuccess, setShowSuccess] = useState(false);

    const [isEditing, setIsEditing] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const userRole = localStorage.getItem("userRole");
    const isAdmin = userRole === "admin";

    const [userData, setUserData] = useState({
        id: "882910",
        nome: "Gennaro",
        cognome: "Esposito",
        dataNascita: "1990-05-12",
        email: "gennaro.esposito@email.com",
        password: "passwordSegreta123",
        telefono: "3331234567"
    });

    const [originalData, setOriginalData] = useState(null);

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

    const handleSave = () => {
        const numeroCompleto = `${userData.prefisso}${userData.telefono}`;

        console.log("Dati inviati al backend:", {
            email: userData.email,
            telefono: numeroCompleto
        });

        if (userData.nuovaPassword) {
            setUserData(prev => ({...prev, password: prev.nuovaPassword}));
        }

        setShowSuccess(true);
        setIsEditing(false);
        setOriginalData(null);
        setShowPassword(false);
    };

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

    const backendPhoneNumber = userData.telefono;

    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    const [prefissiList, setPrefissiList] = useState([]);
    const [loadingPrefixes, setLoadingPrefixes] = useState(true);

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

                        if (numA !== numB) {
                            return numA - numB;
                        }

                        return a.name.localeCompare(b.name);

                        a.name.localeCompare(b.name)});

                const italy = formattedList.find(c => c.iso === 'it');
                const others = formattedList.filter(c => c.iso !== 'it');

                const finalList = italy ? [italy, ...others] : formattedList;

                setPrefissiList(finalList);
                setLoadingPrefixes(false);


                const splitted = splitPhoneNumber(backendPhoneNumber, finalList);
                setUserData(prev => ({
                    ...prev,
                    prefisso: splitted.prefisso,
                    telefono: splitted.telefono
                }));

            } catch (error) {
                console.error("Errore caricamento prefissi:", error);
                setPrefissiList([{ code: "+39", country: "IT", iso: "it", name: "Italy" }]);
                setLoadingPrefixes(false);
            }
        };

        fetchCountries();
    }, []);
    const currentPrefixData = prefissiList.find(p => p.code === userData.prefisso) || { iso: 'it', country: 'IT', name: 'Caricamento...' };

    return (
        <div className="homepage-container">

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
                        <button className="btn-save-contact" onClick={handleSave}>
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
                            value={userData.password}
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
}