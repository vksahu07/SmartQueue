package com.smartqueue.backend.repository;

import com.smartqueue.backend.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, String> {
    List<Service> findByDepId(String depId);
}
