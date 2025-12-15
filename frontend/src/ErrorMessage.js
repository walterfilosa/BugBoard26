import React from 'react';
import { AlertCircle } from 'lucide-react';
import './ErrorMessage.css';

export default function ErrorMessage({ message, onRetry, marginTop="0px" }) {
    const handleRetry = onRetry || (() => window.location.reload());

    return (
        <div className="error-view-container" style={{marginTop: marginTop}}>
            <AlertCircle size={48} className="error-view-icon" />
            <p className="error-view-message">{message || "Si è verificato un errore imprevisto."}</p>
            <button className="btn-retry" onClick={handleRetry}>
                Riprova
            </button>
        </div>
    );
}