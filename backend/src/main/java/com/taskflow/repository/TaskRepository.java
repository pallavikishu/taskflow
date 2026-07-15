package com.taskflow.repository;

import com.taskflow.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByProjectId(String projectId);
    List<Task> findByAssigneeId(String assigneeId);
    void deleteByProjectId(String projectId);
}
