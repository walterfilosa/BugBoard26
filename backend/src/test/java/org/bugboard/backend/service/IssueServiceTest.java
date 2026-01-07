package org.bugboard.backend.service;

import org.bugboard.backend.model.Issue;
import org.bugboard.backend.model.Progetto;
import org.bugboard.backend.model.Utente;
import org.bugboard.backend.repository.IssueRepo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
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

    @Test
    void testAddIssueSuccess() {
        Issue issue = new Issue();
        issue.setTipo("Feature");
        issue.setTitolo("Test");
        issue.setDescrizione("Test");
        issue.setPriorita(5);
        issue.setLinkImmagine("Link immagine");
        issue.setUtenteAssegnato(null);

        Progetto progetto = new Progetto();
        progetto.setIdProgetto(1);
        progetto.setTitolo("Testing");
        progetto.setDescrizione("Testing");

        Utente utente = new Utente();
        utente.setIdUtente(1);
        utente.setNome("Test");
        utente.setCognome("Ing");
        utente.setDataNascita(Date.valueOf("2000-01-01"));
        utente.setNumeroTelefono("999999999");
        utente.setEmail("Test@test.com");
        utente.setPassword("Test");
        utente.setIsAdmin(true);

        HashSet<Utente> utenti = new HashSet<>();
        utenti.add(utente);
        progetto.setSetUtenti(utenti);

        given(issueRepo.save(issue)).willReturn(issue);
        given(optionalService.checkProgetto(progetto.getIdProgetto())).willReturn(progetto);
        given(optionalService.checkUtente(utente.getIdUtente())).willReturn(utente);

        Issue returnedIssue = issueService.addIssue(progetto.getIdProgetto(),utente.getIdUtente(),issue);

        assertThat(returnedIssue.getIdIssue()).isZero();
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

}