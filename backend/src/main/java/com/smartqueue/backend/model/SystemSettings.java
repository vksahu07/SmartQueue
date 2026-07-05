package com.smartqueue.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "system_settings")
public class SystemSettings {
    @Id
    private Long id = 1L; // Only one setting record in db
    
    private String businessHours;
    private String avgHandlingTime;
    private String maxCapacity;
    private boolean autoNotification;
    private String emailConfig;

    public SystemSettings() {}

    public SystemSettings(String businessHours, String avgHandlingTime, String maxCapacity, 
                          boolean autoNotification, String emailConfig) {
        this.businessHours = businessHours;
        this.avgHandlingTime = avgHandlingTime;
        this.maxCapacity = maxCapacity;
        this.autoNotification = autoNotification;
        this.emailConfig = emailConfig;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBusinessHours() { return businessHours; }
    public void setBusinessHours(String businessHours) { this.businessHours = businessHours; }

    public String getAvgHandlingTime() { return avgHandlingTime; }
    public void setAvgHandlingTime(String avgHandlingTime) { this.avgHandlingTime = avgHandlingTime; }

    public String getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(String maxCapacity) { this.maxCapacity = maxCapacity; }

    public boolean isAutoNotification() { return autoNotification; }
    public void setAutoNotification(boolean autoNotification) { this.autoNotification = autoNotification; }

    public String getEmailConfig() { return emailConfig; }
    public void setEmailConfig(String emailConfig) { this.emailConfig = emailConfig; }
}
