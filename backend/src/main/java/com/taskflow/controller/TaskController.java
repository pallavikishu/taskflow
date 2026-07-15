package com.taskflow.controller;

import com.taskflow.dto.TaskRequest;
import com.taskflow.model.Task;
import com.taskflow.security.CurrentUserProvider;
import com.taskflow.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final CurrentUserProvider currentUserProvider;

    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<List<Task>> getTasksForProject(@PathVariable String projectId) {
        String userId = currentUserProvider.getCurrentUserId();
        return ResponseEntity.ok(taskService.getTasksForProject(projectId, userId));
    }

    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<Task> createTask(@PathVariable String projectId,
                                            @Valid @RequestBody TaskRequest request) {
        String userId = currentUserProvider.getCurrentUserId();
        Task created = taskService.createTask(projectId, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<Task> updateTask(@PathVariable String taskId,
                                            @Valid @RequestBody TaskRequest request) {
        String userId = currentUserProvider.getCurrentUserId();
        return ResponseEntity.ok(taskService.updateTask(taskId, request, userId));
    }

    @PatchMapping("/tasks/{taskId}/status")
    public ResponseEntity<Task> updateTaskStatus(@PathVariable String taskId,
                                                  @RequestBody Map<String, String> body) {
        String userId = currentUserProvider.getCurrentUserId();
        Task.Status status = Task.Status.valueOf(body.get("status"));
        return ResponseEntity.ok(taskService.updateTaskStatus(taskId, status, userId));
    }

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable String taskId) {
        String userId = currentUserProvider.getCurrentUserId();
        taskService.deleteTask(taskId, userId);
        return ResponseEntity.noContent().build();
    }
}
