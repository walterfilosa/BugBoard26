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
    if (!response.ok) {
        let errorMessage;
        try {
            const errorBody = await response.json();
            errorMessage = errorBody.message || JSON.stringify(errorBody);
        } catch {
            errorMessage = await response.text();
        }
        throw new Error(errorMessage || `Errore HTTP: ${response.status}`);
    }
    if (response.status === 204) {
        return null;
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    } else {
        return response.text();
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
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });

    return handleResponse(response);
};

export const updateIssue = async (updatedData) => {
    const payload = {
        idIssue: updatedData.id || updatedData.idIssue,
        titolo: updatedData.title,
        descrizione: updatedData.description,
        tipo: updatedData.type,
        priorita: parseInt(updatedData.priority),
        stato: updatedData.status,
        linkImmagine: updatedData.image,
        idAssegnatario: updatedData.assigneeId || null
    };

    const response = await fetch(`${BASE_URL}/admin/issue/update`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });

    return handleResponse(response);
};

export const deleteIssue = async (id) => {
    const response = await fetch(`${BASE_URL}/admin/issue/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    return handleResponse(response);
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

    return {
        id: backendIssue.idIssue,
        title: backendIssue.titolo,
        description: backendIssue.descrizione,
        type: backendIssue.tipo,
        priority: backendIssue.priorita,
        status: backendIssue.stato,
        image: backendIssue.linkImmagine,
        author: backendIssue.EmailCr,
        assigneeId: backendIssue.utenteAssegnato.idUtente,
        assigneeEmail: backendIssue.utenteAssegnato.email,
        assigneeName: (backendIssue.EmailAss || backendIssue.emailAss) ?
            (backendIssue.EmailAss || backendIssue.emailAss).split('@')[0] : "Non assegnato",
        projectId: backendIssue.idProgetto
    };
};

const mapBackendUserToFrontend = (backendUser) => {
    if (!backendUser) return null;
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