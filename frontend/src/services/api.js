const BASE_URL = "https://localhost/api";

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

const handleResponse = async (response) => {
    if (response.status === 401) {
        console.warn("Sessione scaduta o non valida.");
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        window.location.href = '/';
        throw new Error("Sessione scaduta. Effettua nuovamente il login.");
    }

    const textData = await response.text();

    if (!response.ok) {
        let errorMessage = textData;

        try {
            const jsonBody = JSON.parse(textData);
            errorMessage = jsonBody.message || JSON.stringify(jsonBody);
        } catch (e) {
        }

        throw new Error(errorMessage || `Errore HTTP: ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    if (!textData) return null;

    try {
        return JSON.parse(textData);
    } catch {
        return textData;
    }
};

export const loginAPI = async (email, password) => {
    console.log(`API: Login request per ${email}`);
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        throw new Error("Credenziali errate");
    }

    const tokenString = await response.text();

    return {
        accessToken: tokenString
    };
};

export const getIssues = async () => {
    const response = await fetch(`${BASE_URL}/issues`, {
        method: 'GET',
        headers: getHeaders()
    });

    const data = await handleResponse(response);

    return data.map(mapBackendIssueToFrontend);
};

export const getIssueById = async (id) => {
    const response = await fetch(`${BASE_URL}/issues/${id}`, {
        method: 'GET',
        headers: getHeaders()
    });
    const data = await handleResponse(response);

    return mapBackendIssueToFrontend(data);
};

export const getAssignedIssues = async (projectId, userId) => {
    const response = await fetch(`${BASE_URL}/${projectId}/${userId}/issues`, {
        method: 'GET',
        headers: getHeaders()
    });
    const data = await handleResponse(response);
    return data.map(mapBackendIssueToFrontend);
};

export const getOtherIssues = async (projectId, userId) => {
    const response = await fetch(`${BASE_URL}/${projectId}/${userId}/issues/others`, {
        method: 'GET',
        headers: getHeaders()
    });
    const data = await handleResponse(response);
    return data.map(mapBackendIssueToFrontend);
};

export const getToDoIssues = async (projectId) => {
    const response = await fetch(`${BASE_URL}/admin/${projectId}/issues/todo`, {
        method: 'GET',
        headers: getHeaders()
    });
    const data = await handleResponse(response);
    return data.map(mapBackendIssueToFrontend);
};

export const createIssue = async (projectId, userId, issueData) => {
    const payload = {
        titolo: issueData.titolo,
        descrizione: issueData.descrizione,
        tipo: issueData.tipo,
        priorita: parseInt(issueData.priorita),
        stato: "ToDo",
        linkImmagine: issueData.linkImmagine,
        idProgetto: parseInt(projectId),
        EmailCr: issueData.EmailCr || null
    };

    const response = await fetch(`${BASE_URL}/${projectId}/${userId}/issue/add`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });

    return handleResponse(response);
};

export const updateIssue = async (updatedData) => {
    const assigneeId = updatedData.assigneeId || updatedData.idAssegnatario;
    const assigneeEmail = updatedData.assigneeEmail || updatedData.EmailAss;

    const payload = {
        idIssue: updatedData.id || updatedData.idIssue,
        titolo: updatedData.title,
        descrizione: updatedData.description,
        tipo: updatedData.type,
        priorita: parseInt(updatedData.priority),
        stato: updatedData.status,
        linkImmagine: updatedData.image,
        idUtente: updatedData.assigneeId || null,
        utenteAssegnato: assigneeId ? { idUtente: parseInt(assigneeId) } : null,
        EmailAss: assigneeEmail || null,
        emailAssegnato: assigneeEmail || null,
        idAssegnatario: assigneeId ? parseInt(assigneeId) : null
    };

    const response = await fetch(`${BASE_URL}/admin/issue/update`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });

    return handleResponse(response);
};

export const deleteIssue = async (id) => {

    const url = `${BASE_URL}/admin/issue/${id}`;

    if (!id) throw new Error("ID non valido");

    const response = await fetch(url, {
        method: 'DELETE',
        headers: getHeaders()
    });

    return true;

    const errorText = await response.text();

    throw new Error(errorText || `Errore HTTP: ${response.status}`);
};

export const getProjectsByUserId = async (userId) => {
    const response = await fetch(`${BASE_URL}/admin/${userId}/projects`, {
        method: 'GET',
        headers: getHeaders()
    });
    const data = await handleResponse(response);

    return data.map(mapBackendProjectToFrontend);
};

export const getAssignedActiveProjectsFromUserId = async (userId) => {
    const response = await fetch(`${BASE_URL}/${userId}/projects`, {
        method: 'GET',
        headers: getHeaders()
    });
    const data = await handleResponse(response);

    return data.map(mapBackendProjectToFrontend);
};

export const getIssuesByProjectId = async (projectId) => {
    const response = await fetch(`${BASE_URL}/admin/${projectId}/issues`, {
        method: 'GET',
        headers: getHeaders()
    });
    const data = await handleResponse(response);

    return data.map(mapBackendIssueToFrontend);
};

export const getUsersByProjectId = async (projectId) => {
    const response = await fetch(`${BASE_URL}/admin/${projectId}/users`, {
        method: 'GET',
        headers: getHeaders()
    });
    const data = await handleResponse(response);

    return data.map(mapBackendUserToFrontend);
};

export const assignProjectToUser = async (userId, projectId) => {
    const response = await fetch(`${BASE_URL}/admin/${projectId}/assign/${userId}`, {
        method: 'PUT',
        headers: getHeaders()
    });
    return handleResponse(response);
};

export const getAllUsersExceptProject = async (projectId) => {
    const response = await fetch(`${BASE_URL}/admin/${projectId}/users/others`, {
        method: 'GET',
        headers: getHeaders()
    });
    const data = await handleResponse(response);

    return data.map(mapBackendUserToFrontend);
};

export const getUserById = async (id) => {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'GET',
        headers: getHeaders()
    });
    const data = await handleResponse(response);

    return mapBackendUserToFrontend(data);
};

export const createUser = async (userData) => {
    const payload = {
        nome: userData.nome,
        cognome: userData.cognome,
        dataNascita: userData.dataNascita,
        email: userData.email,
        numeroTelefono: userData.numeroTelefono,
        password: userData.password,
        isAdmin: userData.role === 'admin'
    };

    const response = await fetch(`${BASE_URL}/admin/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });

    const data = await handleResponse(response);
    return mapBackendUserToFrontend(data);
};

export const updateUser = async (userData) => {
    const response = await fetch(`${BASE_URL}/users/update`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(userData)
    });
    return handleResponse(response);
};

const mapBackendIssueToFrontend = (backendIssue) => {
    if (!backendIssue) return null;

    const assignedUser = backendIssue.utenteAssegnato;

    return {
        id: backendIssue.idIssue,
        title: backendIssue.titolo,
        description: backendIssue.descrizione,
        type: backendIssue.tipo,
        priority: backendIssue.priorita,
        status: backendIssue.stato,
        image: backendIssue.linkImmagine,
        author: backendIssue.EmailCr || null,
        assigneeId: assignedUser ? assignedUser.idUtente : null,
        assigneeEmail: assignedUser ? assignedUser.email : null,
        assigneeName: (backendIssue.EmailAss || backendIssue.emailAss) ?
            (backendIssue.EmailAss || backendIssue.emailAss).split('@')[0] : "Non assegnato",
        projectId: backendIssue.idProgetto
    };
};

const mapBackendUserToFrontend = (backendUser) => {
    if (!backendUser) return null;
    console.log("Utente dal backend:", backendUser);
    console.log("Valore isAdmin:", backendUser.isAdmin);
    return {
        id: backendUser.idUtente,
        nome: backendUser.nome,
        cognome: backendUser.cognome,
        email: backendUser.email,
        telefono: backendUser.numeroTelefono,
        dataNascita: backendUser.dataNascita,
        role: backendUser.isAdmin ? 'admin' : 'user',
        isAdmin: backendUser.isAdmin
    };
};

const mapBackendProjectToFrontend = (backendProject) => {
    if (!backendProject) return null;
    return {
        id: backendProject.idProgetto,
        title: backendProject.titolo,
        description: backendProject.descrizione,
        status: backendProject.stato
    };
};

export const verifyUserPassword = async (userId, passwordToCheck) => {
    const safePassword = encodeURIComponent(passwordToCheck);
    const url = `${BASE_URL}/verify/${userId}/password/${safePassword}/`;

    const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders()
    });

    return handleResponse(response);
};

export const assignIssueToUser = async (issueId, userId) => {
    console.log(`--- API: Assegnazione Issue ${issueId} a User ${userId} ---`);
    const response = await fetch(`${BASE_URL}/admin/issues/${issueId}/assign/${userId}`, {
        method: 'PUT',
        headers: getHeaders()
    });

    return handleResponse(response);
};

export const setIssueAsSolved = async (issueId) => {
    const response = await fetch(`${BASE_URL}/issues/${issueId}/solved`, {
        method: 'POST',
        headers: getHeaders()
    });
    return handleResponse(response);
};

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: getHeaders()
    });

    if (!response.ok) {
        throw new Error("Errore durante il caricamento dell'immagine");
    }

    const text = await response.text();
    return text;
}