package org.bugboard.backend.controller;

import org.bugboard.backend.model.Utente;
import org.bugboard.backend.service.UtenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
public class UtenteController {

    private final UtenteService service;

    @Autowired
    public UtenteController(UtenteService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public ResponseEntity<Utente> registerUser(@RequestBody Utente utente) {
        return new ResponseEntity<>(service.registerUser(utente), HttpStatus.CREATED);
    }

    @PutMapping("/{userId}/project/{projectId}")
    public ResponseEntity<Utente> assignProjectToUser(
            @PathVariable int userId,
            @PathVariable int projectId
    ){
        return new ResponseEntity<>(service.assignProjectToUser(userId, projectId),HttpStatus.OK);
    }
}
