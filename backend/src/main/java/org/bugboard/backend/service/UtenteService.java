package org.bugboard.backend.service;

import org.bugboard.backend.model.Progetto;
import org.bugboard.backend.model.Utente;
import org.bugboard.backend.repository.ProgettoRepo;
import org.bugboard.backend.repository.UtenteRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

@Service
public class UtenteService {

    private final UtenteRepo utenteRepo;
    private final ProgettoRepo progettoRepo;
    private final ApplicationContext applicationContext;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UtenteService(UtenteRepo repo, ProgettoRepo progettoRepo, ApplicationContext applicationContext, PasswordEncoder passwordEncoder) {
        this.utenteRepo = repo;
        this.progettoRepo = progettoRepo;
        this.applicationContext = applicationContext;
        this.passwordEncoder = passwordEncoder;
    }

    public Utente registerUser(Utente utente) {
        utente.setPassword(passwordEncoder.encode(utente.getPassword()));
        return utenteRepo.save(utente);
    }

    @Transactional
    public Utente assignProjectToUser(int userId, int projectId) {
        Utente user = applicationContext.getBean(Utente.class);
        Progetto project = applicationContext.getBean(Progetto.class);

        Optional<Utente> optUser = utenteRepo.findById(userId);
        if(optUser.isPresent()){
            user=optUser.get();
        }
        Optional<Progetto> optProject = progettoRepo.findById(projectId);
        if(optProject.isPresent()){
            project=optProject.get();
        }

        Set<Progetto> projectSet = user.getProgettiAssegnati();
        projectSet.add(project);
        user.setProgettiAssegnati(projectSet);
        return utenteRepo.save(user);
    }

}
