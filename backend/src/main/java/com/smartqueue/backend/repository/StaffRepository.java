package com.smartqueue.backend.repository;

import com.smartqueue.backend.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StaffRepository extends JpaRepository<Staff, String> {
    List<Staff> findByDepId(String depId);
}
