import React, { useState} from 'react';
import './HomePage.css'
import {useLocation, useNavigate} from "react-router-dom";
import { getTypeIcon } from './utils';
import { ChevronUp, ChevronDown} from 'lucide-react';
import {FiltersBar} from './FiltersBar';
import {FiltersBarSenzaStato} from './FiltersBarSenzaStato';
import {mockIssues, getStatusColor, getStatusIcon} from "./utils";
import { getAllIssues } from "./services/api";

export default function HomePage() {


    // const [issues, setIssues] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    //
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);
//                 const data = await getIssues(); // Chiamata vera al Back-End
//                 setIssues(data); // Salva i dati veri
//             } catch (err) {
//                 console.error(err);
//                 setError("Impossibile caricare le issue. Controlla la connessione.");
//                 // Fallback: se il server è giù, puoi usare i mockIssues per non rompere tutto
//                 // setIssues(mockIssues);
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchData();
//     }, []);
//
//     // 3. Gestione visiva durante il caricamento
//     if (loading) return <div style={{padding: 40, textAlign: 'center'}}>Caricamento dati in corso...</div>;
//     if (error) return <div style={{padding: 40, textAlign: 'center', color: 'red'}}>{error}</div>;
//
//     // ... Il resto del codice rimane uguale, ma userai 'issues' invece di 'mockIssues' ...
//
//     const filteredIssues = issues.filter(issue => ... ); // Usa 'issues' (stato) non 'mockIssues' (costante)
//

    const navigate = useNavigate();
    const location = useLocation();

    const isAdmin = location.pathname.includes("/admin");

    const pageTitle = "Issues";
    const table1Title = isAdmin ? "Issue da assegnare" : "Le tue issue assegnate";

    const initialFilters = { search: "", type: "All", status: "All", priority: "All" };

    const [myFilters, setMyFilters] = useState(initialFilters);
    const [projectFilters, setProjectFilters] = useState(initialFilters);

    const [mySort, setMySort] = useState({ key: null, direction: 'asc' });
    const [projectSort, setProjectSort] = useState({ key: null, direction: 'asc' });

    const filterIssuesLogic = (issues, filters) => {
        return issues.filter(issue => {
            const matchesSearch = issue.title.toLowerCase().includes(filters.search.toLowerCase());
            const matchesType = filters.type === "All" || issue.type === filters.type;
            const matchesStatus = filters.status === "All" || issue.status === filters.status;
            const matchesPriority = filters.priority === "All" || issue.priority == filters.priority;

            return matchesSearch && matchesType && matchesStatus && matchesPriority;
        });
    };

    const sortIssuesLogic = (issues, sortConfig) => {
        if (!sortConfig.key) return issues;

        return [...issues].sort((a, b) => {
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
        ? mockIssues.filter(i => i.status === "To-do")
        : mockIssues.filter(i => i.assignee === "Me");

    const rawProjectIssues = mockIssues;

    const table1List = sortIssuesLogic(filterIssuesLogic(rawTable1Issues, myFilters), mySort);
    const projectList = sortIssuesLogic(filterIssuesLogic(rawProjectIssues, projectFilters), projectSort);

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

    const rawMyIssues = mockIssues.filter(i => i.assignee === "Me");

    const myFinalList = sortIssuesLogic(filterIssuesLogic(rawMyIssues, myFilters), mySort);

    const projectFinalList = sortIssuesLogic(filterIssuesLogic(rawProjectIssues, projectFilters), projectSort);

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