package com.taskflow.dto;

import com.taskflow.model.Task;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.Instant;

@Data
public class TaskRequest {
    @NotBlank(message = "Task title is required")
    private String title;

    private String description;

    private Task.Status status;

    private Task.Priority priority;

    private String assigneeId;

    private Instant dueDate;
}
