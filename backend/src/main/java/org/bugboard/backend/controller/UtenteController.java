package org.bugboard.backend.controller;

import org.bugboard.backend.model.Utente;
import org.bugboard.backend.service.UtenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api")
public class UtenteController {

    private final UtenteService service;

    @Autowired
    public UtenteController(UtenteService service) {
        this.service = service;
    }

    @GetMapping("/admin/{projectId}/users/others")
    public ResponseEntity<List<Utente>> getAllOtherUsers(@PathVariable int projectId) {
        return new ResponseEntity<>(service.getAllOtherUsersFromProject(projectId),HttpStatus.OK);
    }

    @GetMapping("/admin/{projectId}/users")
    public ResponseEntity<List<Utente>> getAllUsersFromProject(@PathVariable int projectId) {
        return new ResponseEntity<>(service.getAllUsersFromProject(projectId),HttpStatus.OK);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<Utente> getUser(@PathVariable int userId) {
        return new ResponseEntity<>(service.getUserFromId(userId),HttpStatus.OK);
    }

    @PutMapping("users/update")
    public ResponseEntity<Utente> updateUser(@RequestBody Utente user) {
        Utente updatedUser=service.updateUser(user);
        if(updatedUser!=null){
            return new ResponseEntity<>(updatedUser,HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/admin/{projectId}/assign/{userId}")
    public ResponseEntity<Utente> assignProjectToUser(
            @PathVariable int projectId,
            @PathVariable int userId) {
        Utente utente=service.assignProjectToUser(projectId,userId);
        if(utente!=null){
            return new ResponseEntity<>(utente, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }



}
