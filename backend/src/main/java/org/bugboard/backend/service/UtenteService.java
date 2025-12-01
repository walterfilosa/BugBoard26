package org.bugboard.backend.service;

import org.bugboard.backend.model.Progetto;
import org.bugboard.backend.model.Utente;
import org.bugboard.backend.repository.ProgettoRepo;
import org.bugboard.backend.repository.UtenteRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UtenteService {

    private final UtenteRepo utenteRepo;
    private final ProgettoRepo progettoRepo;

    @Autowired
    public UtenteService(UtenteRepo repo, ProgettoRepo progettoRepo) {
        this.utenteRepo = repo;
        this.progettoRepo = progettoRepo;
    }

    public List<Utente> getAllUsers() {
        List<Utente> users = utenteRepo.findAll();
        for (Utente u : users) {
            u.setPassword(null);
        }
        return users;
    }

    public Utente assignProjectToUser(int userId, int projectId) {
        Utente user=new Utente();
        Progetto project=new Progetto();
        Set<Progetto> projectSet;

        Optional<Utente> optUser = utenteRepo.findById(userId);
        if(optUser.isPresent()){
            user=optUser.get();
        }
        Optional<Progetto> optProject = progettoRepo.findById(projectId);
        if(optProject.isPresent()){
            project=optProject.get();
        }

        projectSet = user.getProgettiAssegnati();
        projectSet.add(project);
        user.setProgettiAssegnati(projectSet);
        return utenteRepo.save(user);
    }
}
