package org.bugboard.backend.service;

import org.bugboard.backend.model.Progetto;
import org.bugboard.backend.repository.ProgettoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProgettoService {

    private final ProgettoRepo repo;

    @Autowired
    public ProgettoService(ProgettoRepo repo) {
        this.repo = repo;
    }

    public List<Progetto> getAllProjects(){
        return repo.findAll();
    }
}
