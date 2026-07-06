package com.smartqueue.backend.controller;

import com.smartqueue.backend.model.User;
import com.smartqueue.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Please fill in all fields"));
        }

        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Invalid email or password"));
        }

        User user = userOpt.get();
        // Simple password check (no security for local development simulation)
        if (!user.getPassword().equals(request.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Invalid email or password"));
        }

        return ResponseEntity.ok(Map.of("success", true, "user", user));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.getName() == null || request.getEmail() == null || 
            request.getPassword() == null || request.getPhone() == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Please fill in all fields"));
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Email is already registered"));
        }

        User newUser = new User(request.getName(), request.getEmail(), request.getPassword(), "customer", request.getPhone());
        userRepository.save(newUser);
        
        return ResponseEntity.ok(Map.of("success", true, "user", newUser));
    }

    @PostMapping("/switch-role")
    public ResponseEntity<?> switchRole(@RequestBody Map<String, String> request) {
        String role = request.get("role");
        if (role == null) {
            return ResponseEntity.badRequest().body("Role not specified");
        }

        // Simulate Switching role by returning corresponding user details
        String email = "customer@smartqueue.com";
        String name = "Customer User";
        
        if ("admin".equals(role)) {
            email = "admin@smartqueue.com";
            name = "Sarah Jenkins";
        } else if ("staff".equals(role)) {
            email = "staff@smartqueue.com";
            name = "David Miller";
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Just return user with current switched role
            user.setRole(role);
            return ResponseEntity.ok(user);
        }

        User fallback = new User(name, email, "password", role, null);
        return ResponseEntity.ok(fallback);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "User deleted successfully"));
    }

    // Static helper classes for request bodies
    public static class LoginRequest {
        private String email;
        private String password;
        private String role;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private String phone;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
    }
}
