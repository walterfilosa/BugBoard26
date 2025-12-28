package org.bugboard.backend.controller;

import lombok.NonNull;
import org.bugboard.backend.security.UserLogin;
import org.bugboard.backend.model.Utente;
import org.bugboard.backend.service.UtenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthenticationController {

    private final UtenteService service;

    @Autowired
    public AuthenticationController(UtenteService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public ResponseEntity<@NonNull String> loginUser(@RequestBody UserLogin userLogin){
        String response=service.verifyUser(userLogin);
        if(response.equals("Login Failed")){
            return new ResponseEntity<>(response,HttpStatus.UNAUTHORIZED);
        }
        else{
            return new ResponseEntity<>(response,HttpStatus.OK);
        }
    }

    @PostMapping("/admin/register")
    public ResponseEntity<@NonNull Utente> registerUser(@RequestBody Utente utente){
        Utente result=service.registerUser(utente);
        if(result==null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping("/verify/{userId}/password/{inputtedPassword}/")
    public ResponseEntity<Boolean> verifyPassword(@PathVariable int userId,@PathVariable String inputtedPassword){
        return new ResponseEntity<>(service.verifyPassword(userId,inputtedPassword),HttpStatus.OK);
    }

}