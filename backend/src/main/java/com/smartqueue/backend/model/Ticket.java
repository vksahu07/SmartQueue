package com.smartqueue.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tickets")
public class Ticket {
    @Id
    private String id;
    private String queueId;
    private String customerName;
    private String branch;
    private String department; // department name
    private String service;    // service name
    private String staff;      // staff name
    private String date;
    private String timeSlot;
    private String status;     // pending, serving, completed, cancelled, skipped
    private String createdAt;
    private String completedAt;
    private int estimatedWaitTime;

    public Ticket() {}

    public Ticket(String id, String queueId, String customerName, String branch, String department, 
                  String service, String staff, String date, String timeSlot, String status, 
                  String createdAt, String completedAt, int estimatedWaitTime) {
        this.id = id;
        this.queueId = queueId;
        this.customerName = customerName;
        this.branch = branch;
        this.department = department;
        this.service = service;
        this.staff = staff;
        this.date = date;
        this.timeSlot = timeSlot;
        this.status = status;
        this.createdAt = createdAt;
        this.completedAt = completedAt;
        this.estimatedWaitTime = estimatedWaitTime;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getQueueId() { return queueId; }
    public void setQueueId(String queueId) { this.queueId = queueId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getService() { return service; }
    public void setService(String service) { this.service = service; }

    public String getStaff() { return staff; }
    public void setStaff(String staff) { this.staff = staff; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getCompletedAt() { return completedAt; }
    public void setCompletedAt(String completedAt) { this.completedAt = completedAt; }

    public int getEstimatedWaitTime() { return estimatedWaitTime; }
    public void setEstimatedWaitTime(int estimatedWaitTime) { this.estimatedWaitTime = estimatedWaitTime; }
}
