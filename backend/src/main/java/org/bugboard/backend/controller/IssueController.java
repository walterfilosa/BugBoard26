package org.bugboard.backend.controller;

import org.bugboard.backend.model.Issue;
import org.bugboard.backend.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class IssueController {
    private final IssueService service;

    @Autowired
    public IssueController(IssueService service) {
        this.service = service;
    }

    @GetMapping("/{projectId}/{userId}/issues")
    public ResponseEntity<List<Issue>> getAllAssignedIssues(
            @PathVariable int projectId,
            @PathVariable int userId) {
        return new ResponseEntity<>(service.getAllAssignedIssues(projectId,userId), HttpStatus.OK);
    }

    @GetMapping("/{projectId}/{userId}/issues/others")
    public ResponseEntity<List<Issue>> getAllOtherIssues(
            @PathVariable int projectId,
            @PathVariable int userId) {
        return new ResponseEntity<>(service.getAllOtherIssues(projectId,userId), HttpStatus.OK);
    }


    @GetMapping("/admin/{projectId}/issues")
    public ResponseEntity<List<Issue>> getAllIssuesFromProject(@PathVariable int projectId) {
        return new ResponseEntity<>(service.getAllIssuesFromProject(projectId), HttpStatus.OK);
    }

    @GetMapping("/issues/{issueId}")
    public ResponseEntity<Issue> getIssue(@PathVariable int issueId) {
        return new ResponseEntity<>(service.getIssue(issueId),HttpStatus.OK);
    }

    @PutMapping("/{projectId}/{userId}/issue/add")
    public ResponseEntity<Issue> addIssue(
            @PathVariable int projectId,
            @PathVariable int userId,
            @RequestBody Issue issue) {
        Issue newIssue=service.addIssue(projectId,userId,issue);
        if(newIssue!=null) {
            return new ResponseEntity<>(newIssue,HttpStatus.CREATED);
        }
        else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/admin/issue/update")
    public ResponseEntity<Issue> updateIssue(@RequestBody Issue issue) {
        Issue newIssue=service.updateIssue(issue);
        if(newIssue!=null) {
            return new ResponseEntity<>(newIssue,HttpStatus.CREATED);
        }
        else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/admin/issue/{issueId}")
    public ResponseEntity<Issue> deleteIssue(@PathVariable int issueId) {
        Issue issue=service.deleteIssue(issueId);
        if(issue!=null) {
            return new ResponseEntity<>(issue,HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/admin/issues/{issueId}/assign/{userId}")
    public ResponseEntity<Issue> assignIssue(
            @PathVariable int issueId,
            @PathVariable int userId) {
        Issue newIssue=service.assignIssue(issueId,userId);
        if(newIssue!=null) {
            return new ResponseEntity<>(newIssue,HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/issues/{issueId}/solved")
    public ResponseEntity<Issue> setIssueAsSolved(@PathVariable int issueId) {
        Issue issue=service.setIssueAsSolved(issueId);
        if(issue!=null) {
            return new ResponseEntity<>(issue,HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

}
