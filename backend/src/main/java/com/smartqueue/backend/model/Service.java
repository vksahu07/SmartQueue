package com.smartqueue.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "services")
public class Service {
    @Id
    private String id;
    private String depId; // references Department id
    private String name;

    public Service() {}

    public Service(String id, String depId, String name) {
        this.id = id;
        this.depId = depId;
        this.name = name;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDepId() { return depId; }
    public void setDepId(String depId) { this.depId = depId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
