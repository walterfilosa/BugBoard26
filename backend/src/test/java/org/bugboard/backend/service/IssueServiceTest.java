package org.bugboard.backend.service;

import org.bugboard.backend.model.Issue;
import org.bugboard.backend.model.Progetto;
import org.bugboard.backend.model.Utente;
import org.bugboard.backend.repository.IssueRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Date;
import java.util.HashSet;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class IssueServiceTest {

    @Mock
    IssueRepo issueRepo;

    @Mock
    OptionalService optionalService;

    @InjectMocks
    IssueService issueService;

    Issue issue;
    Progetto progetto;
    Utente utente;

    @BeforeEach
    void setUp() {
        issue = Issue.builder()
                .idIssue(1)
                .tipo("Feature")
                .titolo("Test")
                .descrizione("Test")
                .priorita(5)
                .linkImmagine("Link immagine")
                .build();

        progetto = Progetto.builder()
                .idProgetto(1)
                .titolo("Testing")
                .descrizione("Testing").build();

        utente = Utente.builder()
                .idUtente(1)
                .nome("Test")
                .cognome("Ing")
                .dataNascita(Date.valueOf("2000-01-01"))
                .email("Test@test.com")
                .numeroTelefono("999999999")
                .password("Test")
                .isAdmin(true)
                .build();
    }

    @Test
    void testAddIssueSuccess() {
        HashSet<Utente> utenti = new HashSet<>();
        utenti.add(utente);
        progetto.setSetUtenti(utenti);

        given(issueRepo.save(issue)).willReturn(issue);
        given(optionalService.checkProgetto(progetto.getIdProgetto())).willReturn(progetto);
        given(optionalService.checkUtente(utente.getIdUtente())).willReturn(utente);

        Issue returnedIssue = issueService.addIssue(progetto.getIdProgetto(),utente.getIdUtente(),issue);

        assertThat(returnedIssue.getIdIssue()).isEqualTo(1);
        assertThat(returnedIssue.getTipo()).isEqualTo("Feature");
        assertThat(returnedIssue.getTitolo()).isEqualTo("Test");
        assertThat(returnedIssue.getDescrizione()).isEqualTo("Test");
        assertThat(returnedIssue.getPriorita()).isEqualTo(5);
        assertThat(returnedIssue.getLinkImmagine()).isEqualTo("Link immagine");
        assertThat(returnedIssue.getUtenteAssegnato()).isNull();
        assertThat(returnedIssue.getUtenteCreatore()).isEqualTo(utente);
        assertThat(returnedIssue.getProgetto()).isEqualTo(progetto);
        assertThat(returnedIssue.getStato()).isEqualTo("ToDo");

        verify(issueRepo,times(1)).save(issue);
        verify(optionalService,times(1)).checkProgetto(progetto.getIdProgetto());
        verify(optionalService,times(1)).checkUtente(utente.getIdUtente());

    }

    @Test
    void testAddIssueProgettoNotFound(){

        given(optionalService.checkProgetto(Mockito.any(Integer.class))).willReturn(null);

        Issue returnedIssue = issueService.addIssue(1,1,issue);

        assertThat(returnedIssue).isNull();
        verify(optionalService,times(1)).checkProgetto(Mockito.any(Integer.class));
    }

    @Test
    void testAddIssueUtenteNotFound(){

        given(optionalService.checkUtente(Mockito.any(Integer.class))).willReturn(null);

        Issue returnedIssue = issueService.addIssue(1,1,issue);

        assertThat(returnedIssue).isNull();
        verify(optionalService,times(1)).checkUtente(Mockito.any(Integer.class));
    }

    @Test
    void testAddIssueProjectNotCointainsUserFailure(){
        progetto.setSetUtenti(new HashSet<>());

        given(optionalService.checkProgetto(progetto.getIdProgetto())).willReturn(progetto);
        given(optionalService.checkUtente(utente.getIdUtente())).willReturn(utente);

        Issue returnedIssue = issueService.addIssue(progetto.getIdProgetto(),utente.getIdUtente(),issue);

        assertThat(returnedIssue).isNull();

        verify(optionalService,times(1)).checkProgetto(progetto.getIdProgetto());
        verify(optionalService,times(1)).checkUtente(utente.getIdUtente());
    }

    @Test
    void testAssignIssueSuccess(){
        issue.setProgetto(progetto);

        HashSet<Progetto> progetti = new HashSet<>();
        progetti.add(progetto);
        utente.setProgettiAssegnati(progetti);

        HashSet<Utente> utenti = new HashSet<>();
        utenti.add(utente);
        progetto.setSetUtenti(utenti);

        given(optionalService.checkIssue(issue.getIdIssue())).willReturn(issue);
        given(optionalService.checkUtente(utente.getIdUtente())).willReturn(utente);
        given(issueRepo.save(issue)).willReturn(issue);

        Issue returnedIssue = issueService.assignIssue(issue.getIdIssue(), utente.getIdUtente());

        assertThat(returnedIssue.getIdIssue()).isEqualTo(1);
        assertThat(returnedIssue.getTipo()).isEqualTo("Feature");
        assertThat(returnedIssue.getTitolo()).isEqualTo("Test");
        assertThat(returnedIssue.getDescrizione()).isEqualTo("Test");
        assertThat(returnedIssue.getPriorita()).isEqualTo(5);
        assertThat(returnedIssue.getLinkImmagine()).isEqualTo("Link immagine");
        assertThat(returnedIssue.getUtenteAssegnato()).isEqualTo(utente);
        assertThat(returnedIssue.getUtenteCreatore()).isEqualTo(issue.getUtenteCreatore());
        assertThat(returnedIssue.getProgetto()).isEqualTo(issue.getProgetto());
        assertThat(returnedIssue.getStato()).isEqualTo("Assegnata");

        verify(issueRepo,times(1)).save(issue);
        verify(optionalService,times(1)).checkIssue(issue.getIdIssue());
        verify(optionalService,times(1)).checkUtente(utente.getIdUtente());
    }

    @Test
    void testAssignIssueIssueNotFound(){

        given(optionalService.checkIssue(Mockito.any(Integer.class))).willReturn(null);

        Issue returnedIssue = issueService.assignIssue(1,1);

        assertThat(returnedIssue).isNull();
        verify(optionalService,times(1)).checkIssue(Mockito.any(Integer.class));
    }

    @Test
    void testAssignIssueUtenteNotFound(){

        given(optionalService.checkUtente(Mockito.any(Integer.class))).willReturn(null);

        Issue returnedIssue = issueService.assignIssue(1,1);

        assertThat(returnedIssue).isNull();
        verify(optionalService,times(1)).checkUtente(Mockito.any(Integer.class));
    }

    @Test
    void testAssignIssueProjectNotCointainsUserFailure(){
        HashSet<Progetto> progetti = new HashSet<>();
        progetti.add(progetto);
        utente.setProgettiAssegnati(progetti);

        progetto.setSetUtenti(new HashSet<>());

        issue.setProgetto(progetto);

        given(optionalService.checkIssue(issue.getIdIssue())).willReturn(issue);
        given(optionalService.checkUtente(utente.getIdUtente())).willReturn(utente);

        Issue returnedIssue = issueService.assignIssue(issue.getIdIssue(),utente.getIdUtente());

        assertThat(returnedIssue).isNull();

        verify(optionalService,times(1)).checkIssue(issue.getIdIssue());
        verify(optionalService,times(1)).checkUtente(utente.getIdUtente());
    }

    @Test
    void testAssignIssueUserNotCointainsProjectFailure(){
        HashSet<Utente> utenti = new HashSet<>();
        utenti.add(utente);
        progetto.setSetUtenti(utenti);

        utente.setProgettiAssegnati(new HashSet<>());

        issue.setProgetto(progetto);

        given(optionalService.checkIssue(issue.getIdIssue())).willReturn(issue);
        given(optionalService.checkUtente(utente.getIdUtente())).willReturn(utente);

        Issue returnedIssue = issueService.assignIssue(issue.getIdIssue(),utente.getIdUtente());

        assertThat(returnedIssue).isNull();

        verify(optionalService,times(1)).checkIssue(issue.getIdIssue());
        verify(optionalService,times(1)).checkUtente(utente.getIdUtente());
    }

}