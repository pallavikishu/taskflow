package com.taskflow.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "projects")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Project {

    @Id
    private String id;

    private String name;

    private String description;

    private String ownerId;

    @Builder.Default
    private List<String> memberIds = new ArrayList<>();

    @Builder.Default
    private Instant createdAt = Instant.now();
}
