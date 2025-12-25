import React from 'react';
import './ErrorMessage.css';

export default function ErrorMessage({ message, onRetry, marginTop="0px", buttonRefresh=true}) {
    const handleRetry = onRetry || (() => window.location.reload());

    return (
        <div className="error-view-container" style={{marginTop: marginTop}}>
            <img src="/Logo/LogoError.png" className="error-view-icon" />
            <p className="error-view-message">{message || "Si è verificato un errore imprevisto."}</p>
            { buttonRefresh && (
                <button className="btn-retry" onClick={handleRetry}>
                    Riprova
                </button>
            )}
        </div>
    );
}