package com.smartqueue.backend.controller;

import com.smartqueue.backend.model.*;
import com.smartqueue.backend.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/queue")
@CrossOrigin(origins = "*")
public class QueueController {

    private final DepartmentRepository departmentRepository;
    private final ServiceRepository serviceRepository;
    private final StaffRepository staffRepository;
    private final TicketRepository ticketRepository;
    private final AnnouncementRepository announcementRepository;
    private final SystemSettingsRepository systemSettingsRepository;

    public QueueController(DepartmentRepository departmentRepository,
                           ServiceRepository serviceRepository,
                           StaffRepository staffRepository,
                           TicketRepository ticketRepository,
                           AnnouncementRepository announcementRepository,
                           SystemSettingsRepository systemSettingsRepository) {
        this.departmentRepository = departmentRepository;
        this.serviceRepository = serviceRepository;
        this.staffRepository = staffRepository;
        this.ticketRepository = ticketRepository;
        this.announcementRepository = announcementRepository;
        this.systemSettingsRepository = systemSettingsRepository;
    }

    @GetMapping("/branches")
    public List<String> getBranches() {
        return Arrays.asList("Downtown HQ", "Westside Plaza", "Medical District", "East Financial Hub");
    }

    @GetMapping("/departments")
    public List<Department> getDepartments() {
        return departmentRepository.findAll();
    }

    @PostMapping("/departments")
    public ResponseEntity<?> addDepartment(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String code = request.get("code");
        if (name == null || code == null) {
            return ResponseEntity.badRequest().body("Name and code are required");
        }

        String id = "dep-" + System.currentTimeMillis();
        Department department = new Department(id, name, code.toUpperCase());
        departmentRepository.save(department);
        return ResponseEntity.ok(department);
    }

    @GetMapping("/services")
    public List<Service> getServices() {
        return serviceRepository.findAll();
    }

    @GetMapping("/staff")
    public List<Staff> getStaff() {
        return staffRepository.findAll();
    }

    @PostMapping("/staff")
    public ResponseEntity<?> addStaff(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String depId = request.get("depId");
        if (name == null || depId == null) {
            return ResponseEntity.badRequest().body("Name and department ID are required");
        }

        String id = "stf-" + System.currentTimeMillis();
        Staff staff = new Staff(id, name, depId);
        staffRepository.save(staff);
        return ResponseEntity.ok(staff);
    }

    @GetMapping("/tickets")
    public List<Ticket> getTickets() {
        return ticketRepository.findAll();
    }

    @PostMapping("/tickets")
    public ResponseEntity<?> bookToken(@RequestBody BookTokenRequest request) {
        if (request.getBranch() == null || request.getDepartmentName() == null || 
            request.getServiceName() == null || request.getCustomerName() == null) {
            return ResponseEntity.badRequest().body("Required booking fields are missing");
        }

        // Find department code
        Department dep = departmentRepository.findByName(request.getDepartmentName());
        String code = dep != null ? dep.getCode() : "GEN";

        // Generate token sequence
        List<Ticket> depTickets = ticketRepository.findByDepartment(request.getDepartmentName());
        int nextSeq = depTickets.size() + 201;
        String queueId = code + "-" + nextSeq;

        // Est wait time calculation
        long pendingCount = ticketRepository.findByDepartmentAndStatus(request.getDepartmentName(), "pending").size();
        int estTime = (int) (pendingCount + 1) * 15;

        String id = "tok-" + System.currentTimeMillis();
        String staffName = request.getStaffName() != null && !request.getStaffName().isEmpty() 
                           ? request.getStaffName() : "Any Available Staff";

        Ticket ticket = new Ticket(
                id,
                queueId,
                request.getCustomerName(),
                request.getBranch(),
                request.getDepartmentName(),
                request.getServiceName(),
                staffName,
                request.getDate(),
                request.getTimeSlot(),
                "pending",
                Instant.now().toString(),
                null,
                estTime
        );

        ticketRepository.save(ticket);
        return ResponseEntity.ok(ticket);
    }

    @PutMapping("/tickets/{id}/cancel")
    public ResponseEntity<?> cancelTicket(@PathVariable String id) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Ticket ticket = ticketOpt.get();
        ticket.setStatus("cancelled");
        ticketRepository.save(ticket);
        return ResponseEntity.ok(ticket);
    }

    @PutMapping("/tickets/{id}/complete")
    public ResponseEntity<?> completeTicket(@PathVariable String id) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Ticket ticket = ticketOpt.get();
        ticket.setStatus("completed");
        ticket.setCompletedAt(Instant.now().toString());
        ticketRepository.save(ticket);
        return ResponseEntity.ok(ticket);
    }

    @PutMapping("/tickets/{id}/skip")
    public ResponseEntity<?> skipTicket(@PathVariable String id) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Ticket ticket = ticketOpt.get();
        ticket.setStatus("skipped");
        ticketRepository.save(ticket);
        return ResponseEntity.ok(ticket);
    }

    @PutMapping("/tickets/{id}/serve")
    public ResponseEntity<?> serveTicket(@PathVariable String id, @RequestBody Map<String, String> request) {
        String staffName = request.get("staffName");
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (staffName != null && !staffName.isEmpty()) {
            List<Ticket> serving = ticketRepository.findByStaffAndStatus(staffName, "serving");
            for (Ticket t : serving) {
                t.setStatus("completed");
                t.setCompletedAt(Instant.now().toString());
                ticketRepository.save(t);
            }
        }

        Ticket ticket = ticketOpt.get();
        ticket.setStatus("serving");
        if (staffName != null && !staffName.isEmpty()) {
            ticket.setStaff(staffName);
        }
        ticketRepository.save(ticket);
        
        recalculateWaitTimes(ticket.getDepartment());
        return ResponseEntity.ok(ticket);
    }

    @PostMapping("/call-next")
    public ResponseEntity<?> callNext(@RequestBody Map<String, String> request) {
        String departmentName = request.get("departmentName");
        String staffName = request.get("staffName");

        if (departmentName == null || staffName == null) {
            return ResponseEntity.badRequest().body("Department and Staff names are required");
        }

        // Find currently serving ticket for this staff and mark as completed
        List<Ticket> servingTickets = ticketRepository.findByStaffAndStatus(staffName, "serving");
        for (Ticket t : servingTickets) {
            t.setStatus("completed");
            t.setCompletedAt(Instant.now().toString());
            ticketRepository.save(t);
        }

        // Find the first pending ticket for this department
        List<Ticket> pendingTickets = ticketRepository.findByDepartmentAndStatus(departmentName, "pending");
        if (!pendingTickets.isEmpty()) {
            Ticket nextPending = pendingTickets.get(0);
            nextPending.setStatus("serving");
            nextPending.setStaff(staffName);
            ticketRepository.save(nextPending);

            // Recalculate other pending tickets' wait times in this department
            recalculateWaitTimes(departmentName);

            return ResponseEntity.ok(nextPending);
        }

        return ResponseEntity.ok().body(Map.of("message", "No pending tickets in this department", "status", "idle"));
    }

    private void recalculateWaitTimes(String departmentName) {
        List<Ticket> pendingTickets = ticketRepository.findByDepartmentAndStatus(departmentName, "pending");
        for (Ticket ticket : pendingTickets) {
            int newTime = Math.max(0, ticket.getEstimatedWaitTime() - 15);
            ticket.setEstimatedWaitTime(newTime);
            ticketRepository.save(ticket);
        }
    }

    @GetMapping("/announcements")
    public List<Announcement> getAnnouncements() {
        return announcementRepository.findAllByOrderByIdDesc();
    }

    @PostMapping("/announcements")
    public ResponseEntity<?> postAnnouncement(@RequestBody Map<String, String> request) {
        String text = request.get("text");
        String type = request.get("type");
        if (text == null) {
            return ResponseEntity.badRequest().body("Text is required");
        }

        String typeStr = type != null ? type : "info";
        Announcement announcement = new Announcement(text, typeStr, "Just now");
        announcementRepository.save(announcement);
        return ResponseEntity.ok(announcement);
    }

    @GetMapping("/settings")
    public ResponseEntity<?> getSettings() {
        Optional<SystemSettings> settingsOpt = systemSettingsRepository.findById(1L);
        if (settingsOpt.isPresent()) {
            return ResponseEntity.ok(settingsOpt.get());
        }
        
        SystemSettings fallback = new SystemSettings("09:00 AM - 05:00 PM", "15 mins", "200 per day", true, "smtp.smartqueue.com");
        systemSettingsRepository.save(fallback);
        return ResponseEntity.ok(fallback);
    }

    @PutMapping("/settings")
    public ResponseEntity<?> updateSettings(@RequestBody SystemSettings request) {
        SystemSettings settings = systemSettingsRepository.findById(1L)
                .orElse(new SystemSettings());
        
        if (request.getBusinessHours() != null) settings.setBusinessHours(request.getBusinessHours());
        if (request.getAvgHandlingTime() != null) settings.setAvgHandlingTime(request.getAvgHandlingTime());
        if (request.getMaxCapacity() != null) settings.setMaxCapacity(request.getMaxCapacity());
        settings.setAutoNotification(request.isAutoNotification());
        if (request.getEmailConfig() != null) settings.setEmailConfig(request.getEmailConfig());

        systemSettingsRepository.save(settings);
        return ResponseEntity.ok(settings);
    }

    // Helper class for booking request
    public static class BookTokenRequest {
        private String branch;
        private String departmentName;
        private String serviceName;
        private String staffName;
        private String date;
        private String timeSlot;
        private String customerName;

        public String getBranch() { return branch; }
        public void setBranch(String branch) { this.branch = branch; }
        public String getDepartmentName() { return departmentName; }
        public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
        public String getServiceName() { return serviceName; }
        public void setServiceName(String serviceName) { this.serviceName = serviceName; }
        public String getStaffName() { return staffName; }
        public void setStaffName(String staffName) { this.staffName = staffName; }
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public String getTimeSlot() { return timeSlot; }
        public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }
        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }
    }
}
