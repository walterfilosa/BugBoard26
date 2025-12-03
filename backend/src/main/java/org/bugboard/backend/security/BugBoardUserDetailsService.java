package org.bugboard.backend.security;

import org.bugboard.backend.model.Utente;
import org.bugboard.backend.repository.UtenteRepo;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class BugBoardUserDetailsService implements UserDetailsService {

    private final UtenteRepo utenteRepo;

    @Autowired
    public BugBoardUserDetailsService(UtenteRepo utenteRepo) {
        this.utenteRepo = utenteRepo;
    }

    @Override
    public @NonNull UserDetails loadUserByUsername(@NonNull String username) throws UsernameNotFoundException {
        Utente user=utenteRepo.findByEmail(username);
        if(user==null) {
            throw new UsernameNotFoundException("User not found");
        }
        return new UserPrincipal(user);
    }
}
