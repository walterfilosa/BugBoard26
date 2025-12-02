package org.bugboard.backend.repository;

import org.bugboard.backend.model.Progetto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgettoRepo extends JpaRepository<Progetto,Integer> {
    List<Progetto> findBySetUtenti_idUtenteAndStato(int setUtentiIdUtente, String stato);
}
