package org.bugboard.backend.controller;

import org.bugboard.backend.model.Progetto;
import org.bugboard.backend.service.ProgettoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ProgettoController {
    private final ProgettoService service;

    @Autowired
    public ProgettoController(ProgettoService service) {
        this.service = service;
    }

    @GetMapping("/projects")
    public ResponseEntity<List<Progetto>> getAllProjects() {
        return new ResponseEntity<>(service.getAllProjects(), HttpStatus.OK);
    }
}
