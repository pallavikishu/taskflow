package com.taskflow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class ProjectRequest {
    @NotBlank(message = "Project name is required")
    private String name;

    private String description;

    private List<String> memberIds;
}
