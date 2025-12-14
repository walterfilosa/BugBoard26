import React from 'react';
import './LoadingSpinner.css';

export default function LoadingSpinner({ message, logoWidth = "100px", paddingTop = "140px"}) {
    return (
        <div className="loading-container">
            <img
                src="/Logo/LogoSpin.png"
                alt="Caricamento..."
                className="loading-logo-spinning"
                style={{ width: logoWidth, height: 'auto', marginTop: paddingTop }}
            />

            {message && <p className="spinner-message">{message}</p>}
        </div>
    );
}