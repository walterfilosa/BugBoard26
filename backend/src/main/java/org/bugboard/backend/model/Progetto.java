package org.bugboard.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.stereotype.Component;
import java.util.HashSet;
import java.util.Set;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Component
public class Progetto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idprogetto")
    private int idProgetto;
    private String titolo;
    private String descrizione;
    private String stato;

    @JsonIgnore
    @ManyToMany(mappedBy = "progettiAssegnati")
    private Set<Utente> setUtenti=new HashSet<>();
}
