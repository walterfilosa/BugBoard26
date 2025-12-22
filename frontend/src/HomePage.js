import React, {useEffect, useState} from 'react';
import './HomePage.css'
import { useNavigate } from "react-router-dom";
import { getTypeIcon, getStatusColor, getStatusIcon } from './utils';
import { ChevronUp, ChevronDown, AlertCircle} from 'lucide-react';
import {FiltersBar} from './FiltersBar';
import {FiltersBarSenzaStato} from './FiltersBarSenzaStato';
import {getAssignedIssues, getOtherIssues, getToDoIssues} from "./services/api";
import LoadingSpinner from './LoadingSpinner';
import {useAuth} from "./context/AuthContext";
import ErrorMessage from "./ErrorMessage";
import NoResultMessage from "./NoResultMessage";

export default function HomePage() {

    const [listToDo, setListToDo] = useState([]);
    const [listAssigned, setListAssigned] = useState([]);
    const [listOthers, setListOthers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();

    const currentProjectId = localStorage.getItem("currentProjectId") || 1;

    const initialFilters = { search: "", type: "All", status: "All", priority: "All" };

    const [myFilters, setMyFilters] = useState(initialFilters);
    const [projectFilters, setProjectFilters] = useState(initialFilters);
    const [adminAssignedFilters, setAdminAssignedFilters] = useState(initialFilters);
    const [adminAssignedSort, setAdminAssignedSort] = useState({ key: null, direction: 'asc' });

    const [mySort, setMySort] = useState({ key: null, direction: 'asc' });
    const [projectSort, setProjectSort] = useState({ key: null, direction: 'asc' });

    useEffect(() => {
        const fetchData = async () => {
            if(!currentProjectId || !user?.id) return;

            setLoading(true);
            setError(null);

            try {
                if (isAdmin) {
                    const [todoData, assignedData, othersData] = await Promise.all([
                        getToDoIssues(currentProjectId),
                        getAssignedIssues(currentProjectId, user.id),
                        getOtherIssues(currentProjectId, user.id)
                    ]);

                    setListToDo(todoData);
                    setListAssigned(assignedData);
                    setListOthers(othersData);

                } else {
                    const [assignedData, othersData] = await Promise.all([
                        getAssignedIssues(currentProjectId, user.id),
                        getOtherIssues(currentProjectId, user.id)
                    ]);

                    setListAssigned(assignedData);
                    setListOthers(othersData);
                }

            } catch (err) {
                console.error("Errore fetch dati:", err);
                setError("Impossibile caricare le issue dal server.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentProjectId, user, isAdmin]);

    const pageTitle = "Issues";
    const table1Title = isAdmin ? "Issue da assegnare" : "Le tue issue assegnate";

    const filterIssuesLogic = (issuesList, filters) => {
        if (!issuesList) return [];
        return issuesList.filter(issue => {
            const matchesSearch = issue.title.toLowerCase().includes(filters.search.toLowerCase());
            const matchesType = filters.type === "All" || issue.type === filters.type;
            const matchesStatus = filters.status === "All" || issue.status === filters.status;
            const matchesPriority = filters.priority === "All" || issue.priority === filters.priority;

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

    const rawTable1Issues = isAdmin ? listToDo : listAssigned;

    const myFinalList = sortIssuesLogic(filterIssuesLogic(rawTable1Issues, myFilters), mySort);
    const adminAssignedFinalList = sortIssuesLogic(
        filterIssuesLogic(listAssigned, adminAssignedFilters),
        adminAssignedSort
    );

    const projectFinalList = sortIssuesLogic(filterIssuesLogic(listOthers, projectFilters), projectSort);

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

    const renderRow = (issue) => {

        const isUrlAdmin = window.location.pathname.includes("/admin");
        const effectiveAdmin = isAdmin || isUrlAdmin;

        return (


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
    )};

    if (loading) {
        return <LoadingSpinner message="Caricamento issues..." />;
    }
    if (error) {
        return (
            <ErrorMessage message={error}/>
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
                            <NoResultMessage message={"Nessuna issue trovata"}/>
                    )}
                </div>
            </div>

            {isAdmin && (
                <>
                    <div className="header-row" style={{ marginTop: '40px' }}>
                        <h1>Le tue issue assegnate</h1>
                    </div>

                    <FiltersBarSenzaStato
                        filters={adminAssignedFilters}
                        setFilters={setAdminAssignedFilters}
                        onReset={() => setAdminAssignedFilters(initialFilters)}
                    />

                    <div className="issues-table-container">
                        <div className="issues-header">
                            <div className="col col-title sortable-header" onClick={() => handleSortClick('title', adminAssignedSort, setAdminAssignedSort)}>
                                Titolo {renderSortIcon('title', adminAssignedSort)}
                            </div>
                            <div className="col col-priority sortable-header" onClick={() => handleSortClick('priority', adminAssignedSort, setAdminAssignedSort)}>
                                Priorità {renderSortIcon('priority', adminAssignedSort)}
                            </div>
                            <div className="col col-type sortable-header" onClick={() => handleSortClick('type', adminAssignedSort, setAdminAssignedSort)}>
                                Tipo {renderSortIcon('type', adminAssignedSort)}
                            </div>
                        </div>

                        <div className="issues-list">
                            {adminAssignedFinalList.length > 0 ? (
                                adminAssignedFinalList.map(issue => renderRow(issue))
                            ) : (
                                    <NoResultMessage message={"Non hai issue assegnate al momento"}/>
                            )}
                        </div>
                    </div>
                </>
            )}

            <div className="header-row" style={{ marginTop: '40px' }}>
                <h1>Altre issue nel progetto</h1>
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
                        projectFinalList.map(issue => (
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
                                ))
                    ) : (
                            <NoResultMessage message={"Nessuna issue nel progetto"}/>
                    )}
                </div>
            </div>

        </div>
    );
}