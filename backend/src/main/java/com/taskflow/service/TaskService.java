package com.taskflow.service;

import com.taskflow.dto.TaskRequest;
import com.taskflow.exception.ApiException;
import com.taskflow.model.Project;
import com.taskflow.model.Task;
import com.taskflow.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectService projectService;

    public List<Task> getTasksForProject(String projectId, String userId) {
        // will throw if user does not have access to the project
        projectService.getProjectById(projectId, userId);
        return taskRepository.findByProjectId(projectId);
    }

    public Task createTask(String projectId, TaskRequest request, String userId) {
        Project project = projectService.getProjectById(projectId, userId);

        Task task = Task.builder()
                .projectId(project.getId())
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : Task.Status.TODO)
                .priority(request.getPriority() != null ? request.getPriority() : Task.Priority.MEDIUM)
                .assigneeId(request.getAssigneeId())
                .createdById(userId)
                .dueDate(request.getDueDate())
                .build();

        return taskRepository.save(task);
    }

    public Task updateTask(String taskId, TaskRequest request, String userId) {
        Task task = getTaskAndCheckAccess(taskId, userId);

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        task.setAssigneeId(request.getAssigneeId());
        task.setDueDate(request.getDueDate());

        return taskRepository.save(task);
    }

    public Task updateTaskStatus(String taskId, Task.Status status, String userId) {
        Task task = getTaskAndCheckAccess(taskId, userId);
        task.setStatus(status);
        return taskRepository.save(task);
    }

    public void deleteTask(String taskId, String userId) {
        Task task = getTaskAndCheckAccess(taskId, userId);
        taskRepository.delete(task);
    }

    private Task getTaskAndCheckAccess(String taskId, String userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ApiException("Task not found", HttpStatus.NOT_FOUND));

        // Validates the requesting user has access to the parent project
        projectService.getProjectById(task.getProjectId(), userId);
        return task;
    }
}
