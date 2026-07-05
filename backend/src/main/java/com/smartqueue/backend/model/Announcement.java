package com.smartqueue.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "announcements")
public class Announcement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(length = 1000)
    private String text;
    
    private String type; // warning, info
    private String time;

    public Announcement() {}

    public Announcement(String text, String type, String time) {
        this.text = text;
        this.type = type;
        this.time = time;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
}
