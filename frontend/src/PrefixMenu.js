import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import './PrefixMenu.css';

export default function PrefixMenu({ selectedPrefix, selectedIso, onSelect, disabled }) {

    const [list, setList] = useState([]); // Lista scaricata dall'API
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const DEFAULT_COUNTRY = { iso: 'it', country: 'IT', code: '+39', name: 'Italy' };

    const dropdownRef = useRef(null);


    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('https://restcountries.com/v3.1/all?fields=idd,cca2,name');
                const data = await response.json();

                let formattedList = data
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
                    });

                formattedList.sort((a, b) => {

                    const numA = parseInt(a.code.replace(/\D/g, ''));
                    const numB = parseInt(b.code.replace(/\D/g, ''));

                    if (numA !== numB) {
                        return numA - numB;
                    }

                    return a.name.localeCompare(b.name)});

                const italy = formattedList.find(c => c.iso === 'it');
                const others = formattedList.filter(c => c.iso !== 'it');
                const finalList = italy ? [italy, ...others] : formattedList;

                setList(finalList);
                setLoading(false);

            } catch (error) {
                console.error("Errore caricamento prefissi:", error);
                setList([{ code: "+39", country: "IT", iso: "it", name: "Italy" }]);
                setLoading(false);
            }
        };

        fetchCountries();
    }, []);


    const currentData = list.find(p => p.iso === selectedIso)
        || list.find(p => p.code === selectedPrefix)
        || DEFAULT_COUNTRY;

    const filteredList = list.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.includes(searchTerm)
    );


    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm("");
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (countryData) => {
        onSelect(countryData.code, countryData.iso);
        setIsOpen(false);
        setSearchTerm("");
    };

    return (
        <div
            className={`floating-label-group prefix-wrapper ${disabled ? "disabled-group" : ""}`}
            ref={dropdownRef}
        >
            <div
                className={`campo custom-select-trigger ${disabled ? "disabled-input" : ""}`}
                onClick={() => !loading && !disabled && setIsOpen(!isOpen)}
            >
                {loading ? (
                    <span style={{fontSize: '12px', color: '#999'}}>...</span>
                ) : (
                    <>
                        <img
                            src={`https://flagcdn.com/w40/${currentData.iso.toLowerCase()}.png`}
                            alt={currentData.country}
                            className="flag-icon"
                        />
                        <span>{selectedPrefix || currentData.code}</span>
                        <ChevronDown size={16} className="dropdown-arrow" />
                    </>
                )}
            </div>

            <label className="floating-label">Prefisso</label>

            {!disabled && isOpen && !loading && (
                <div className="custom-dropdown-options">

                    <div className="prefix-search-container">
                        <Search size={14} className="prefix-search-icon"/>
                        <input
                            type="text"
                            className="prefix-search-input"
                            placeholder="Cerca prefisso o paese..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    <div className="prefix-list-scroll">
                        {filteredList.length > 0 ? (
                            filteredList.map((p, index) => (
                                <div
                                    key={`${p.code}-${index}`}
                                    className="custom-option"
                                    onClick={() => handleSelect(p)}
                                >
                                    <img
                                        src={`https://flagcdn.com/w40/${p.iso.toLowerCase()}.png`}
                                        alt={p.country}
                                        className="flag-icon"
                                    />
                                    <span>{p.code} ({p.name})</span>
                                </div>
                            ))
                        ) : (
                            <div className="custom-option no-results">Nessun risultato</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}