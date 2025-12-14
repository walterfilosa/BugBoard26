import React, {useEffect, useState} from 'react';
import './HomePage.css'
import { useNavigate } from "react-router-dom";
import { getTypeIcon, getStatusColor, getStatusIcon } from './utils';
import { ChevronUp, ChevronDown, AlertCircle} from 'lucide-react';
import {FiltersBar} from './FiltersBar';
import {FiltersBarSenzaStato} from './FiltersBarSenzaStato';
import { getIssuesByProjectId } from "./services/api";
import LoadingSpinner from './LoadingSpinner';
import {useAuth} from "./context/AuthContext";

export default function HomePage() {


    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();

    const currentProjectId = localStorage.getItem("currentProjectId") || 1;

    const initialFilters = { search: "", type: "All", status: "All", priority: "All" };

    const [myFilters, setMyFilters] = useState(initialFilters);
    const [projectFilters, setProjectFilters] = useState(initialFilters);

    const [mySort, setMySort] = useState({ key: null, direction: 'asc' });
    const [projectSort, setProjectSort] = useState({ key: null, direction: 'asc' });

    useEffect(() => {
         const fetchData = async () => {
             if(!currentProjectId) return;
             try {
                 setLoading(true);
                 const data = await getIssuesByProjectId(currentProjectId); // Chiamata vera al Back-End
                 setIssues(data);
             } catch (err) {
                 console.error(err);
                 setError("Impossibile caricare le issue. Controlla la connessione.");
             } finally {
                 setLoading(false);
             }
         };

         fetchData();
     }, [currentProjectId]);

    const pageTitle = "Issues";
    const table1Title = isAdmin ? "Issue da assegnare" : "Le tue issue assegnate";

    const filterIssuesLogic = (issuesList, filters) => {
        if (!issuesList) return [];
        return issuesList.filter(issue => {
            const matchesSearch = issue.title.toLowerCase().includes(filters.search.toLowerCase());
            const matchesType = filters.type === "All" || issue.type === filters.type;
            const matchesStatus = filters.status === "All" || issue.status === filters.status;
            const matchesPriority = filters.priority === "All" || issue.priority == filters.priority;

            return matchesSearch && matchesType && matchesStatus && matchesPriority;
        });
    };

    const sortIssuesLogic = (issuesList, sortConfig) => {
        if (!sortConfig.key) return issuesList;

        return [...issuesList].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const rawTable1Issues = isAdmin
        ? issues.filter(i => i.status === "ToDo")
        : issues.filter(i => i.assigneeEmail === user?.email);

    const rawProjectIssues = issues;

    const myFinalList = sortIssuesLogic(filterIssuesLogic(rawTable1Issues, myFilters), mySort);
    const projectFinalList = sortIssuesLogic(filterIssuesLogic(rawProjectIssues, projectFilters), projectSort);

    const handleSortClick = (key, currentSort, setSort) => {
        let direction = 'asc';
        if (currentSort.key === key && currentSort.direction === 'asc') {
            direction = 'desc';
        }
        setSort({ key, direction });
    };

    const renderSortIcon = (columnKey, currentSort) => {
        if (currentSort.key !== columnKey) return <ChevronDown size={16} className="sort-icon inactive" />;
        return currentSort.direction === 'asc'
            ? <ChevronUp size={16} className="sort-icon active" />
            : <ChevronDown size={16} className="sort-icon active" />;
    };

    const renderRow = (issue) => (
        <div key={issue.id} className="issue-row" onClick={() => navigate(isAdmin ? `/admin/dettaglio-issue/${issue.id}` : `/dettaglio-issue/${issue.id}`)}>
            <div className="col col-title">
                <span className="issue-title-text">{issue.title}</span>
            </div>
            <div className="col col-priority">
                <div className="priority-bar-track">
                    <div className="priority-bar-fill" style={{ width: `${(issue.priority / 5) * 100}%` }}></div>
                </div>
                <span className="priority-text">{issue.priority}/5</span>
            </div>
            <div className="col col-type">
                <div className={`type-badge type-${issue.type.toLowerCase()}`}>
                    {getTypeIcon(issue.type)}
                    <span>{issue.type}</span>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return <LoadingSpinner message="Caricamento issues..." />;
    }
    if (error) {
        return (
            <div style={{padding: 100, textAlign: 'center', color: 'red', display:'flex', flexDirection:'column', alignItems:'center'}}>
                <AlertCircle size={48} />
                <p>{error}</p>
                <button className="riprova-button" onClick={() => window.location.reload()}>Riprova</button>
            </div>
        );
    }


    return (
        <div className="homepage">
            <div className="homepage-container">
                <h1>{pageTitle}</h1>
            </div>



            <div className="header-row">
                <h1>{table1Title}</h1>
            </div>

            <FiltersBarSenzaStato
                filters={myFilters}
                setFilters={setMyFilters}
                onReset={() => setMyFilters(initialFilters)}
            />

            <div className="issues-table-container">
                <div className="issues-header">
                    <div className="col col-title sortable-header" onClick={() => handleSortClick('title', mySort, setMySort)}>
                        Titolo {renderSortIcon('title', mySort)}
                    </div>
                    <div className="col col-priority sortable-header" onClick={() => handleSortClick('priority', mySort, setMySort)}>
                        Priorità {renderSortIcon('priority', mySort)}
                    </div>
                    <div className="col col-type sortable-header" onClick={() => handleSortClick('type', mySort, setMySort)}>
                        Tipo {renderSortIcon('type', mySort)}
                    </div>
                </div>

                <div className="issues-list">
                    {myFinalList.length > 0 ? (
                        myFinalList.map(issue => renderRow(issue))
                    ) : (
                        <div className="no-results">
                            <p>Nessuna issue trovata.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="header-row" style={{ marginTop: '40px' }}>
                <h1>Tutte le issue del progetto</h1>
            </div>

            <FiltersBar
                filters={projectFilters}
                setFilters={setProjectFilters}
                onReset={() => setProjectFilters(initialFilters)}
            />

            <div className="issues-table-container">
                <div className="issues-header grid-4-cols">
                    <div className="col col-title sortable-header" onClick={() => handleSortClick('title', projectSort, setProjectSort)}>
                        Titolo {renderSortIcon('title', projectSort)}
                    </div>
                    <div className="col col-priority sortable-header" onClick={() => handleSortClick('priority', projectSort, setProjectSort)}>
                        Priorità {renderSortIcon('priority', projectSort)}
                    </div>
                    <div className="col col-type sortable-header" onClick={() => handleSortClick('type', projectSort, setProjectSort)}>
                        Tipo {renderSortIcon('type', projectSort)}
                    </div>
                    <div className="col col-status sortable-header" onClick={() => handleSortClick('status', projectSort, setProjectSort)}>
                        Stato {renderSortIcon('status', projectSort)}
                    </div>
                </div>

                <div className="issues-list">
                    {projectFinalList.length > 0 ? (
                        projectFinalList.map(issue =>
                            <div
                                key={issue.id}
                                className="issue-row grid-4-cols"
                                onClick={() => navigate(isAdmin ? `/admin/dettaglio-issue/${issue.id}` : `/dettaglio-issue/${issue.id}`)}
                            >
                                <div className="col col-title">
                                    <span className="issue-title-text">{issue.title}</span>
                                </div>
                                <div className="col col-priority">
                                    <div className="priority-bar-track">
                                        <div className="priority-bar-fill" style={{ width: `${(issue.priority / 5) * 100}%` }}></div>
                                    </div>
                                    <span className="priority-text">{issue.priority}/5</span>
                                </div>
                                <div className="col col-type">
                                    <div className={`type-badge type-${issue.type.toLowerCase()}`}>
                                        {getTypeIcon(issue.type)}
                                        <span>{issue.type}</span>
                                    </div>
                                </div>

                                <div className="col col-status">
                                <span className={`status-badge ${getStatusColor(issue.status)}`}>
                                    {getStatusIcon(issue.status, 16)}
                                    {issue.status}
                                </span>
                                </div>
                            </div>
                                )
                    ) : (
                        <div className="no-results">
                            <p>Nessuna issue nel progetto.</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}