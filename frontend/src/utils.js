import {
    Clock,
    FileText,
    Construction,
    CircleCheckBig,
    CircleQuestionMark,
    Lightbulb,
    CircleAlert,
    Bug,
} from 'lucide-react';

export const mockIssues = [
    {
        id: 101, title: "Errore nel login con Google", type: "Bug", priority: 5, status: "Assegnata", assignee: "Me",
        description: "Quando provo a cliccare sul tasto 'Accedi con Google'...",
        image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&q=80&w=1000",
        fileName: "screenshot_errore_login.jpg",
        assigneeId: 100
    },
    {
        id: 102, title: "Richiesta documentazione API", type: "Documentation", priority: 2, status: "Risolta", assignee: "Luigi",
        description: "Avrei bisogno della documentazione aggiornata...",
        image: null,
        fileName: null, assigneeId: 200
    },{ id: 103, title: "Aggiungere Dark Mode", type: "Feature", priority: 3, status: "Assegnata", assignee: "Anna" },
    { id: 104, title: "Disallineamento Navbar su Mobile", type: "Bug", priority: 4, status: "To-do", assignee: "Me" },
    { id: 105, title: "Come resettare la password?", type: "Question", priority: 1, status: "Risolta", assignee: "Sofia" },
    { id: 106, title: "Errore 404 su pagina profilo", type: "Bug", priority: 5, status: "To-do", assignee: "Me" },
    { id: 107, title: "Migliorare performance dashboard", type: "Feature", priority: 3, status: "Assegnata", assignee: "Team" },
    { id: 108, title: "Traduzione incompleta in Inglese", type: "Bug", priority: 2, status: "To-do", assignee: "Giovanni" },
    { id: 109, title: "Aggiornare termini e condizioni", type: "Documentation", priority: 1, status: "Risolta", assignee: "Me" },
    { id: 110, title: "Il footer si sovrappone al contenuto", type: "Bug", priority: 3, status: "To-do", assignee: "Me" },
    { id: 111, title: "Richiesta export in PDF", type: "Feature", priority: 4, status: "Assegnata", assignee: "Me" },
    { id: 112, title: "Login lento da Safari", type: "Bug", priority: 4, status: "To-do", assignee: "Marco" },
];

export const mockUsers = [
    { id: 1, nome: "Mario", cognome: "Rossi", email: "mario.rossi@email.com", role: "user", dataNascita: '2025-12-09', telefono: "0818991010" },
    { id: 2, nome: "Luigi", cognome: "Verdi", email: "luigi.admin@bugboard.it", role: "admin" },
    { id: 3, nome: "Anna", cognome: "Bianchi", email: "anna.bianchi@email.com", role: "user" },
    { id: 4, nome: "Gennaro", cognome: "Esposito", email: "gennaro.dev@email.com", role: "user" },
    { id: 5, nome: "Sofia", cognome: "Neri", email: "sofia.lead@bugboard.it", role: "admin" },
    { id: 6, nome: "Marco", cognome: "Gialli", email: "marco.gialli@email.com", role: "user" },
];

export const potentialUsersToAdd = [
    { id: 99, nome: "Alessandro", cognome: "Volta", email: "ale.volta@email.com", role: "user" },
    { id: 100, nome: "Galileo", cognome: "Galilei", email: "g.galilei@email.com", role: "admin" },
    { id: 101, nome: "Leonardo", cognome: "Da Vinci", email: "leo.davinci@email.com", role: "user" },
];

export const mockProjects = [
    { id: 1, title: "App Mobile iOS", description: "Sviluppo della nuova applicazione nativa per iPhone.", status: "Attivo", manager: "Mario Rossi" },
    { id: 2, title: "Refactoring Backend", description: "Migrazione del database e pulizia del codice legacy.", status: "In sospeso", manager: "Luigi Verdi" },
    { id: 3, title: "Sito Web Corporate", description: "Redesign completo del portale istituzionale.", status: "Attivo", manager: "Anna Bianchi" },
    { id: 4, title: "Integrazione API Pagamenti", description: "Implementazione Stripe e PayPal.", status: "Chiuso", manager: "Mario Rossi" },
    { id: 5, title: "Dashboard Analytics", description: "Nuovi grafici e reportistica per gli admin.", status: "Attivo", manager: "Sofia Neri" },
    { id: 6, title: "Marketing Q4", description: "Campagna pubblicitaria fine anno.", status: "Chiuso", manager: "Gennaro Esposito" },
];




export const getTypeIcon = (type, size = 16) => {
    switch(type) {
        case "Bug": return <Bug size={size} />;
        case "Feature": return <Lightbulb size={size} />;
        case "Documentation": return <FileText size={size} />;
        case "Question": return <CircleQuestionMark size={size}/>;
        default: return <CircleAlert size={size} />;
    }
};

export const getStatusIcon = (status, size=20) => {
    switch(status) {
        case "To-do": return <Clock size={size}/>;
        case "Assegnata": return <Construction size={size}/>;
        case "Risolta": return <CircleCheckBig size={size}/>
        default: return <CircleAlert size={size}/>;
    }
}

export const getStatusColor = (status) => {
    switch(status) {
        case "To-do": return "status-todo";
        case "Assegnata": return "status-assegnata";
        case "Risolta": return "status-risolta";
        default: return "";
    }
};