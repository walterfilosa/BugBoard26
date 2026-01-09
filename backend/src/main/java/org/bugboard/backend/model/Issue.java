package org.bugboard.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.stereotype.Component;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Component
public class Issue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="idissue")
    private int idIssue;
    private String tipo;
    private String titolo;
    private String descrizione;
    @Column(name="priorità")
    private int priorita;
    @Column(name="immagine")
    private String linkImmagine;
    private String stato;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name="idprogetto")
    private Progetto progetto;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name="idcreatore",referencedColumnName="idutente")
    private Utente utenteCreatore;

    @ManyToOne
    @JoinColumn(name="idassegnato",referencedColumnName="idutente")
    private Utente utenteAssegnato;
}
