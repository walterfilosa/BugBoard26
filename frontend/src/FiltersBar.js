import {Filter, Search, X} from "lucide-react";
import React from "react";
import './FiltersBar.css';

export const FiltersBar = ({ filters, setFilters, onReset }) => {

    const updateFilter = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const hasActiveFilters =
        filters.type !== "All" ||
        filters.status !== "All" ||
        filters.priority !== "All" ||
        filters.search !== "";

    return (
        <div className="filters-container">
            <div className="filters-group">
                <Filter size={18} className="filter-label-icon" />
                <span className="filter-label-text">Filtra per:</span>

                <select
                    className={`filter-select ${filters.type !== "All" ? "active" : ""}`}
                    value={filters.type}
                    onChange={(e) => updateFilter('type', e.target.value)}
                >
                    <option value="All">Tutti i Tipi</option>
                    <option value="Bug">Bug</option>
                    <option value="Feature">Feature</option>
                    <option value="Documentation">Documentation</option>
                    <option value="Question">Question</option>
                </select>

                <select
                    className={`filter-select ${filters.status !== "All" ? "active" : ""}`}
                    value={filters.status}
                    onChange={(e) => updateFilter('status', e.target.value)}
                >
                    <option value="All">Tutti gli Stati</option>
                    <option value="To-do">To-do</option>
                    <option value="Assegnata">Assegnata</option>
                    <option value="Risolta">Risolta</option>
                    <option value="Aperta">Aperta</option>
                    <option value="In Corso">In Corso</option>
                    <option value="Chiusa">Chiusa</option>
                </select>

                <select
                    className={`filter-select ${filters.priority !== "All" ? "active" : ""}`}
                    value={filters.priority}
                    onChange={(e) => updateFilter('priority', e.target.value)}
                >
                    <option value="All">Tutte le Priorità</option>
                    <option value="5">5 - Critica</option>
                    <option value="4">4 - Alta</option>
                    <option value="3">3 - Media</option>
                    <option value="2">2 - Bassa</option>
                    <option value="1">1 - Minima</option>
                </select>

                <div className="search-box">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Cerca per titolo..."
                        value={filters.search}
                        onChange={(e) => updateFilter('search', e.target.value)}
                    />
                </div>
            </div>

            {hasActiveFilters && (
                <button className="btn-reset-filters" onClick={onReset}>
                    <X size={16} /> Resetta filtri
                </button>
            )}
        </div>
    );
};