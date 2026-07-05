package com.smartqueue.backend.config;

import com.smartqueue.backend.model.*;
import com.smartqueue.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final ServiceRepository serviceRepository;
    private final StaffRepository staffRepository;
    private final TicketRepository ticketRepository;
    private final AnnouncementRepository announcementRepository;
    private final SystemSettingsRepository systemSettingsRepository;

    public DatabaseSeeder(UserRepository userRepository,
                          DepartmentRepository departmentRepository,
                          ServiceRepository serviceRepository,
                          StaffRepository staffRepository,
                          TicketRepository ticketRepository,
                          AnnouncementRepository announcementRepository,
                          SystemSettingsRepository systemSettingsRepository) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.serviceRepository = serviceRepository;
        this.staffRepository = staffRepository;
        this.ticketRepository = ticketRepository;
        this.announcementRepository = announcementRepository;
        this.systemSettingsRepository = systemSettingsRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedDepartments();
        seedServices();
        seedStaff();
        seedSettings();
        seedAnnouncements();
        seedTickets();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            userRepository.save(new User("John Doe", "customer@smartqueue.com", "password", "customer", "+1 (555) 019-2834"));
            userRepository.save(new User("Sarah Jenkins", "admin@smartqueue.com", "password", "admin", null));
            userRepository.save(new User("David Miller", "staff@smartqueue.com", "password", "staff", null));
            System.out.println("Seeded initial users successfully.");
        }
    }

    private void seedDepartments() {
        if (departmentRepository.count() == 0) {
            departmentRepository.save(new Department("dep-1", "General Consulting", "GEN"));
            departmentRepository.save(new Department("dep-2", "Premium Banking", "PRM"));
            departmentRepository.save(new Department("dep-3", "Technical Support", "TEC"));
            departmentRepository.save(new Department("dep-4", "Medical/OPD", "MED"));
            System.out.println("Seeded initial departments successfully.");
        }
    }

    private void seedServices() {
        if (serviceRepository.count() == 0) {
            serviceRepository.save(new Service("srv-1", "dep-1", "Account Queries"));
            serviceRepository.save(new Service("srv-2", "dep-1", "Document Verification"));
            serviceRepository.save(new Service("srv-3", "dep-2", "Wealth Management"));
            serviceRepository.save(new Service("srv-4", "dep-2", "Loan Application"));
            serviceRepository.save(new Service("srv-5", "dep-3", "Device Troubleshooting"));
            serviceRepository.save(new Service("srv-6", "dep-3", "Software Setup"));
            serviceRepository.save(new Service("srv-7", "dep-4", "General Physician"));
            serviceRepository.save(new Service("srv-8", "dep-4", "Pediatrics Consultation"));
            System.out.println("Seeded initial services successfully.");
        }
    }

    private void seedStaff() {
        if (staffRepository.count() == 0) {
            staffRepository.save(new Staff("stf-1", "Dr. Emily Stark", "dep-4"));
            staffRepository.save(new Staff("stf-2", "Michael Chang", "dep-2"));
            staffRepository.save(new Staff("stf-3", "Sophia Patel", "dep-1"));
            staffRepository.save(new Staff("stf-4", "David Ross", "dep-3"));
            System.out.println("Seeded initial staff successfully.");
        }
    }

    private void seedSettings() {
        if (systemSettingsRepository.count() == 0) {
            SystemSettings settings = new SystemSettings("09:00 AM - 05:00 PM", "15 mins", "200 per day", true, "smtp.smartqueue.com");
            systemSettingsRepository.save(settings);
            System.out.println("Seeded default system settings successfully.");
        }
    }

    private void seedAnnouncements() {
        if (announcementRepository.count() == 0) {
            announcementRepository.save(new Announcement("We are experiencing high volume in Premium Banking today. Apologies for any delays.", "warning", "10 mins ago"));
            announcementRepository.save(new Announcement("Self-service kiosks are now operational on the ground floor.", "info", "1 hour ago"));
            System.out.println("Seeded initial announcements successfully.");
        }
    }

    private void seedTickets() {
        if (ticketRepository.count() == 0) {
            ticketRepository.save(new Ticket(
                    "tok-101", "GEN-201", "Robert Vance", "Downtown HQ",
                    "General Consulting", "Account Queries", "Sophia Patel",
                    "2026-07-04", "09:30 AM", "completed",
                    "2026-07-04T09:05:00Z", "2026-07-04T09:45:00Z", 0
            ));
            ticketRepository.save(new Ticket(
                    "tok-102", "TEC-301", "Alice Green", "Downtown HQ",
                    "Technical Support", "Device Troubleshooting", "David Ross",
                    "2026-07-04", "10:00 AM", "completed",
                    "2026-07-04T09:40:00Z", "2026-07-04T10:15:00Z", 0
            ));
            ticketRepository.save(new Ticket(
                    "tok-103", "MED-401", "Clara Oswald", "Medical District",
                    "Medical/OPD", "General Physician", "Dr. Emily Stark",
                    "2026-07-04", "11:15 AM", "serving",
                    "2026-07-04T11:00:00Z", null, 0
            ));
            ticketRepository.save(new Ticket(
                    "tok-104", "PRM-101", "Thomas Shelby", "Downtown HQ",
                    "Premium Banking", "Wealth Management", "Michael Chang",
                    "2026-07-04", "11:30 AM", "serving",
                    "2026-07-04T11:10:00Z", null, 0
            ));
            ticketRepository.save(new Ticket(
                    "tok-105", "GEN-202", "Peter Parker", "Downtown HQ",
                    "General Consulting", "Document Verification", "Sophia Patel",
                    "2026-07-04", "11:45 AM", "pending",
                    "2026-07-04T11:12:00Z", null, 12
            ));
            ticketRepository.save(new Ticket(
                    "tok-106", "MED-402", "Bruce Banner", "Medical District",
                    "Medical/OPD", "General Physician", "Dr. Emily Stark",
                    "2026-07-04", "12:00 PM", "pending",
                    "2026-07-04T11:20:00Z", null, 25
            ));
            ticketRepository.save(new Ticket(
                    "tok-107", "TEC-302", "Diana Prince", "Downtown HQ",
                    "Technical Support", "Software Setup", "David Ross",
                    "2026-07-04", "12:15 PM", "pending",
                    "2026-07-04T11:25:00Z", null, 38
            ));
            System.out.println("Seeded initial mock bookings successfully.");
        }
    }
}
