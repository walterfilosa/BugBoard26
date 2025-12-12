package org.bugboard.backend.service;

import org.bugboard.backend.model.Issue;
import org.bugboard.backend.model.Progetto;
import org.bugboard.backend.model.Utente;
import org.bugboard.backend.repository.IssueRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class IssueService {
    private final IssueRepo issueRepo;
    private final OptionalService optionalService;

    @Autowired
    public IssueService(IssueRepo issueRepo, OptionalService optionalService) {
        this.issueRepo = issueRepo;
        this.optionalService = optionalService;
    }

    public List<Issue> getAllAssignedIssues(int projectId,int userId) {
        return issueRepo.findIssuesByProgetto_IdProgettoAndUtenteAssegnato_IdUtenteOrderByStato(projectId,userId);
    }

    public List<Issue> getAllOtherIssues(int projectId,int userId) {
        return issueRepo.findIssuesByProgetto_IdProgettoAndUtenteAssegnato_IdUtenteIsNotOrProgetto_IdProgettoAndStato(projectId,userId,projectId,"ToDo");
    }

    public List<Issue> getAllIssuesFromProject(int projectId) {
        return issueRepo.findIssuesByProgetto_IdProgetto(projectId);
    }

    public Issue getIssue(int issueId) {
        return optionalService.checkIssue(issueId);
    }

    @Transactional
    public Issue addIssue(int projectId,int userId,Issue issue) {
        Progetto project=optionalService.checkProgetto(projectId);
        Utente user=optionalService.checkUtente(userId);
        if(project!=null && user!=null) {
            if(!project.getSetUtenti().contains(user)) {
                return null;
            }
            issue.setProgetto(project);
            issue.setUtenteCreatore(user);
            issue.setStato("ToDo");
            issue.setLinkImmagine("https://i1.rgstatic.net/ii/profile.image/272449132560396-1441968344623_Q512/Sergio-Di-Martino.jpg");
            return issueRepo.save(issue);
        }
        return null;
    }

    public Issue updateIssue(Issue updatedIssue) {
        Issue oldIssue;
        Optional<Issue> optIssue = issueRepo.findById(updatedIssue.getIdIssue());
        if (optIssue.isPresent()) {
            oldIssue = optIssue.get();
            updatedIssue.setProgetto(oldIssue.getProgetto());
            updatedIssue.setUtenteAssegnato(oldIssue.getUtenteAssegnato());
            updatedIssue.setUtenteCreatore(oldIssue.getUtenteCreatore());
            return issueRepo.save(updatedIssue);
        }
        return null;
    }

    public Issue deleteIssue(int issueId) {
        Issue issue = optionalService.checkIssue(issueId);
        if(issue!=null){
            issueRepo.delete(issue);
        }
        return null;
    }


    public Issue assignIssue(int issueId, int userId) {
        Issue issue = optionalService.checkIssue(issueId);
        Utente user = optionalService.checkUtente(userId);

        if(issue!=null && user!=null) {
            issue.setUtenteAssegnato(user);
            issue.setStato("Assegnata");
            return issueRepo.save(issue);
        }
        return null;
    }

    public Issue setIssueAsSolved(int issueId) {
        Issue issue = optionalService.checkIssue(issueId);
        if(issue!=null){
            if(!issue.getStato().equals("Assegnata")){
                return null;
            }
            issue.setStato("Risolta");
            return issueRepo.save(issue);
        }
        return null;
    }

}
