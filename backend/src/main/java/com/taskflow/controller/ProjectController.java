package com.taskflow.controller;

import com.taskflow.dto.ProjectRequest;
import com.taskflow.model.Project;
import com.taskflow.security.CurrentUserProvider;
import com.taskflow.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final CurrentUserProvider currentUserProvider;

    @GetMapping
    public ResponseEntity<List<Project>> getMyProjects() {
        String userId = currentUserProvider.getCurrentUserId();
        return ResponseEntity.ok(projectService.getProjectsForUser(userId));
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<Project> getProject(@PathVariable String projectId) {
        String userId = currentUserProvider.getCurrentUserId();
        return ResponseEntity.ok(projectService.getProjectById(projectId, userId));
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@Valid @RequestBody ProjectRequest request) {
        String userId = currentUserProvider.getCurrentUserId();
        Project created = projectService.createProject(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<Project> updateProject(@PathVariable String projectId,
                                                  @Valid @RequestBody ProjectRequest request) {
        String userId = currentUserProvider.getCurrentUserId();
        return ResponseEntity.ok(projectService.updateProject(projectId, request, userId));
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(@PathVariable String projectId) {
        String userId = currentUserProvider.getCurrentUserId();
        projectService.deleteProject(projectId, userId);
        return ResponseEntity.noContent().build();
    }
}
