package org.bugboard.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;


@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Progetto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idprogetto")
    private int idProgetto;
    private String titolo;
    private String descrizione;
    private String stato;


    @JsonIgnore
    @ManyToMany(mappedBy = "progettiAssegnati", fetch = FetchType.EAGER)
    private Set<Utente> setUtenti=new HashSet<>();
}
