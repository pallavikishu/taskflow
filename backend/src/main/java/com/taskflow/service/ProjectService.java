package com.taskflow.service;

import com.taskflow.dto.ProjectRequest;
import com.taskflow.exception.ApiException;
import com.taskflow.model.Project;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public List<Project> getProjectsForUser(String userId) {
        return projectRepository.findByOwnerIdOrMemberIdsContaining(userId, userId);
    }

    public Project getProjectById(String projectId, String userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ApiException("Project not found", HttpStatus.NOT_FOUND));

        assertAccess(project, userId);
        return project;
    }

    public Project createProject(ProjectRequest request, String ownerId) {
        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .ownerId(ownerId)
                .memberIds(request.getMemberIds() != null ? request.getMemberIds() : new ArrayList<>())
                .build();

        return projectRepository.save(project);
    }

    public Project updateProject(String projectId, ProjectRequest request, String userId) {
        Project project = getProjectById(projectId, userId);
        assertOwner(project, userId);

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        if (request.getMemberIds() != null) {
            project.setMemberIds(request.getMemberIds());
        }

        return projectRepository.save(project);
    }

    public void deleteProject(String projectId, String userId) {
        Project project = getProjectById(projectId, userId);
        assertOwner(project, userId);

        taskRepository.deleteByProjectId(projectId);
        projectRepository.delete(project);
    }

    private void assertAccess(Project project, String userId) {
        boolean isOwner = project.getOwnerId().equals(userId);
        boolean isMember = project.getMemberIds() != null && project.getMemberIds().contains(userId);
        if (!isOwner && !isMember) {
            throw new ApiException("You do not have access to this project", HttpStatus.FORBIDDEN);
        }
    }

    private void assertOwner(Project project, String userId) {
        if (!project.getOwnerId().equals(userId)) {
            throw new ApiException("Only the project owner can perform this action", HttpStatus.FORBIDDEN);
        }
    }
}
