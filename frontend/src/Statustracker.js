import React from 'react';
import './StatusTracker.css';
import { CheckCircle, Clock, Construction } from 'lucide-react';

const steps = ["To-do", "Assegnata", "Risolta"];

export default function StatusTracker({ status, onMarkAsSolved, onMarkAsAssigned, isEditing, onStatusChange, canResolve }) {


    const getStepIndex = (currentStatus) => {
        if (!currentStatus) return 0;
        const s = currentStatus.toLowerCase();

        if (s === "risolta" || s === "closed" || s === "chiusa") return 2;
        if (s === "assegnata" || s === "in corso" || s === "assigned") return 1;
        return 0;
    };

    const currentStepIndex = getStepIndex(status);

    const getThemeClass = (index) => {
        switch (index) {
            case 1: return "tracker-state-assigned";
            case 2: return "tracker-state-solved";
            default: return "tracker-state-todo";
        }
    };

    const themeClass = getThemeClass(currentStepIndex);

    const getStepConfig = (index) => {
        switch (index) {
            case 0:
                return { icon: <Clock size={14} strokeWidth={2.5} />, className: "is-todo" };
            case 1:
                return { icon: <Construction size={14} strokeWidth={2.5} />, className: "is-assigned" };
            case 2:
                return { icon: <CheckCircle size={14} strokeWidth={3} />, className: "is-solved" };
            default:
                return { icon: <CheckCircle size={14} />, className: "" };
        }
    };

    return (
        <div className={`status-tracker-container ${themeClass}`}>

            <div className="status-label">
                {isEditing ? "Seleziona nuovo stato:" : ""}
            </div>

            <div className="stepper-wrapper">
                {steps.map((stepName, index) => {

                    const isCompleted = index <= currentStepIndex;
                    const isActive = index === currentStepIndex;

                    const { icon, className } = getStepConfig(index);

                    return (
                        <React.Fragment key={index}>
                            <div className={`step-item ${className} ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''} ${isEditing ? 'editable-step' : ''}`} onClick={() => {
                                if (isEditing && onStatusChange) {
                                    onStatusChange(stepName);
                                }
                            }}>
                                <span className="step-text">{stepName}</span>
                                <div className="step-circle">
                                    {icon}
                                </div>
                            </div>

                            {index < steps.length - 1 && (
                                <div className={`step-line ${index < currentStepIndex ? 'completed' : ''}`}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {currentStepIndex === 1 && !isEditing && canResolve && (
                <button className="btn-quick-resolve" onClick={onMarkAsSolved}>
                    <CheckCircle size={16} /> Segna come Risolta
                </button>
            )}
            {currentStepIndex === 0 && !isEditing && canResolve && (
                <button className="btn-quick-assign" onClick={onMarkAsAssigned}>
                    <Construction size={16} /> Assegna Issue
                </button>
            )}
        </div>
    );
}