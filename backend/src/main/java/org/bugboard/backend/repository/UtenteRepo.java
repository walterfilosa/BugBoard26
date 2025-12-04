package org.bugboard.backend.repository;

import lombok.NonNull;
import org.bugboard.backend.model.Utente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UtenteRepo extends JpaRepository<@NonNull Utente,@NonNull Integer> {
    Utente findByEmail(String username);
}
