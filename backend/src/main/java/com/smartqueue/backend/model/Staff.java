package com.smartqueue.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "staff")
public class Staff {
    @Id
    private String id;
    private String name;
    private String depId; // references Department id

    public Staff() {}

    public Staff(String id, String name, String depId) {
        this.id = id;
        this.name = name;
        this.depId = depId;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDepId() { return depId; }
    public void setDepId(String depId) { this.depId = depId; }
}
