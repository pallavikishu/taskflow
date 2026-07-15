package com.taskflow.repository;

import com.taskflow.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProjectRepository extends MongoRepository<Project, String> {
    List<Project> findByOwnerIdOrMemberIdsContaining(String ownerId, String memberId);
}
