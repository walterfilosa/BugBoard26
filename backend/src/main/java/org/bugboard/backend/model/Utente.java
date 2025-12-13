package org.bugboard.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Component
public class Utente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idutente")
    private int idUtente;
    private String nome;
    private String cognome;
    @Column(name = "datadinascita")
    private Date dataNascita;
    private String email;
    @Column(name = "numeroditelefono")
    private String numeroTelefono;
    private String password;
    @Column(name = "isadmin")
    private Boolean isAdmin;

    @JsonIgnore
    @ManyToMany
    @JoinTable(name= "Lavora",
            joinColumns = @JoinColumn(name= "idutente"),
            inverseJoinColumns = @JoinColumn(name= "idprogetto")
    )
    private Set<Progetto> progettiAssegnati=new HashSet<>();

}
