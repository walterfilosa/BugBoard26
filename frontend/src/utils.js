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
        id: 101, title: "Errore nel login con Google", type: "Bug", priority: 5, status: "To-do", assignee: "Me",
        description: "Quando provo a cliccare sul tasto 'Accedi con Google'...",
        image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&q=80&w=1000",
        fileName: "screenshot_errore_login.jpg" // Nome del file
    },
    {
        id: 102, title: "Richiesta documentazione API", type: "Documentation", priority: 2, status: "Risolta", assignee: "Luigi",
        description: "Avrei bisogno della documentazione aggiornata...",
        image: null,
        fileName: null
    },{ id: 103, title: "Aggiungere Dark Mode", type: "Feature", priority: 3, status: "Assegnata", assignee: "Anna" },
    { id: 104, title: "Disallineamento Navbar su Mobile", type: "Bug", priority: 4, status: "To-do", assignee: "Me" },
    { id: 105, title: "Come resettare la password?", type: "Question", priority: 1, status: "Risolta", assignee: "Sofia" },
    { id: 106, title: "Errore 404 su pagina profilo", type: "Bug", priority: 5, status: "To-do", assignee: "Me" },
    { id: 107, title: "Migliorare performance dashboard", type: "Feature", priority: 3, status: "In Corso", assignee: "Team" },
    { id: 108, title: "Traduzione incompleta in Inglese", type: "Bug", priority: 2, status: "To-do", assignee: "Giovanni" },
    { id: 109, title: "Aggiornare termini e condizioni", type: "Documentation", priority: 1, status: "Risolta", assignee: "Me" },
    { id: 110, title: "Il footer si sovrappone al contenuto", type: "Bug", priority: 3, status: "To-do", assignee: "Me" },
    { id: 111, title: "Richiesta export in PDF", type: "Feature", priority: 4, status: "Assegnata", assignee: "Me" },
    { id: 112, title: "Login lento da Safari", type: "Bug", priority: 4, status: "To-do", assignee: "Marco" },
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