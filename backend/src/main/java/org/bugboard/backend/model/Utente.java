package org.bugboard.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
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

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name="Lavora",
            joinColumns = @JoinColumn(name="idutente"),
            inverseJoinColumns = @JoinColumn(name="idprogetto")
    )
    private Set<Progetto> progettiAssegnati=new HashSet<>();

}
