package com.smartqueue.backend.repository;

import com.smartqueue.backend.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, String> {
    Department findByName(String name);
}
