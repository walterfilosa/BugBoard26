package org.bugboard.backend.service;

import org.bugboard.backend.model.Progetto;
import org.bugboard.backend.model.UserLogin;
import org.bugboard.backend.model.Utente;
import org.bugboard.backend.repository.UtenteRepo;
import org.bugboard.backend.security.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UtenteService {

    private final UtenteRepo utenteRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final OptionalService optionalService;

    @Autowired
    public UtenteService(UtenteRepo repo,PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JWTService jwtService, OptionalService optionalService) {
        this.utenteRepo = repo;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.optionalService = optionalService;
    }

    public String verifyUser(UserLogin userLogin) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userLogin.getEmail(), userLogin.getPassword()));
        if(authentication.isAuthenticated()) {
            Utente user = utenteRepo.findByEmail(userLogin.getEmail());
            return jwtService.generateToken(user);
        }
        return "Login Failed";
    }

    public Utente registerUser(Utente utente){
        Utente user = utenteRepo.findByEmail(utente.getEmail());
        if(user==null){
            utente.setPassword(passwordEncoder.encode(utente.getPassword()));
            return utenteRepo.save(utente);
        }
        return null;
    }

    @Transactional
    public Utente assignProjectToUser(int projectId, int userId) {
        Progetto project=optionalService.checkProgetto(projectId);
        Utente user=optionalService.checkUtente(userId);

        if(project!=null && user!=null){
            Set<Progetto> projectSet = user.getProgettiAssegnati();
            projectSet.add(project);
            user.setProgettiAssegnati(projectSet);
            return utenteRepo.save(user);
        }

        return null;
    }

    public List<Utente> getAllUsersFromProject(int projectId) {
        return utenteRepo.findByProgettiAssegnati_idProgetto(projectId);
    }

    public List<Utente> getAllOtherUsersFromProject(int projectId) {
        List<Utente> utenteList = utenteRepo.findByProgettiAssegnati_idProgettoIsNot(projectId);
        utenteList.removeIf(utente -> utenteRepo.existsUtenteByProgettiAssegnati_idProgettoAndIdUtente(projectId, utente.getIdUtente()));
        return utenteList;
    }

    public Utente getUserFromId(int userId) {
        return optionalService.checkUtente(userId);
    }

    public Utente updateUser(Utente updatedUser) {
        Utente oldUser;
        Optional<Utente> optUtente = utenteRepo.findById(updatedUser.getIdUtente());
        if(optUtente.isPresent()) {
            oldUser = optUtente.get();
            updatedUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            updatedUser.setProgettiAssegnati(oldUser.getProgettiAssegnati());
            return utenteRepo.save(updatedUser);
        }
        return null;
    }
}
