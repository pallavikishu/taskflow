package com.taskflow.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "tasks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    private String id;

    private String projectId;

    private String title;

    private String description;

    @Builder.Default
    private Status status = Status.TODO;

    @Builder.Default
    private Priority priority = Priority.MEDIUM;

    private String assigneeId;

    private String createdById;

    @Builder.Default
    private Instant createdAt = Instant.now();

    private Instant dueDate;

    public enum Status {
        TODO,
        IN_PROGRESS,
        DONE
    }

    public enum Priority {
        LOW,
        MEDIUM,
        HIGH
    }
}
