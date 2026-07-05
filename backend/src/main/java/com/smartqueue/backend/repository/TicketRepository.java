package com.smartqueue.backend.repository;

import com.smartqueue.backend.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, String> {
    List<Ticket> findByDepartment(String department);
    List<Ticket> findByDepartmentAndStatus(String department, String status);
    List<Ticket> findByStaffAndStatus(String staff, String status);
}
