package org.bugboard.backend.service;

import org.bugboard.backend.model.Progetto;
import org.bugboard.backend.repository.ProgettoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class ProgettoService {

    private final ProgettoRepo progettoRepo;

    @Autowired
    public ProgettoService(ProgettoRepo repo) {
        this.progettoRepo = repo;
    }

    public List<Progetto> getAssignedActiveProjectsFromUserId(int userId) {
        return progettoRepo.findBySetUtenti_idUtenteAndStato(userId,"Attivo");
    }

    public List<Progetto> getAllProjects() {
        return progettoRepo.findAll();
    }
}
