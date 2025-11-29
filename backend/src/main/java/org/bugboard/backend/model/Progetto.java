package org.bugboard.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Progetto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idprogetto;
    private String titolo;
    private String descrizione;
    private String stato;
}
