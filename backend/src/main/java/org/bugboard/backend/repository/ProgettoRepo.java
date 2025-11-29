package org.bugboard.backend.repository;

import org.bugboard.backend.model.Progetto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgettoRepo extends JpaRepository<Progetto,Integer> {
}
