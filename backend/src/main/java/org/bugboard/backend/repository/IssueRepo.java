package org.bugboard.backend.repository;

import org.bugboard.backend.model.Issue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssueRepo extends JpaRepository<Issue,Integer> {

    List<Issue> findIssuesByProgetto_IdProgetto(int projectId);

    List<Issue> findIssuesByProgetto_IdProgettoAndUtenteAssegnato_IdUtenteOrderByStato(int progettoIdProgetto, int utenteAssegnatoIdUtente);

    List<Issue> findIssuesByProgetto_IdProgettoAndUtenteAssegnato_IdUtenteIsNotOrProgetto_IdProgettoAndStato(int progettoIdProgetto, int utenteAssegnatoIdUtente, int progettoIdProgetto1, String stato);
}
