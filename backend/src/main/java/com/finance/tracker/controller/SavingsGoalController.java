package com.finance.tracker.controller;

import com.finance.tracker.dto.SavingsGoalDTO;
import com.finance.tracker.entity.User;
import com.finance.tracker.service.SavingsGoalService;
import com.finance.tracker.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/savings-goals")
@RequiredArgsConstructor
public class SavingsGoalController {

    private final SavingsGoalService savingsGoalService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<SavingsGoalDTO>> getAllGoals(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(savingsGoalService.getAllGoals(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SavingsGoalDTO> getGoalById(@PathVariable Long id,
                                                       @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(savingsGoalService.getGoalById(id, user));
    }

    @PostMapping
    public ResponseEntity<SavingsGoalDTO> createGoal(@Valid @RequestBody SavingsGoalDTO dto,
                                                      @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(savingsGoalService.createGoal(dto, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SavingsGoalDTO> updateGoal(@PathVariable Long id,
                                                      @Valid @RequestBody SavingsGoalDTO dto,
                                                      @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(savingsGoalService.updateGoal(id, dto, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        savingsGoalService.deleteGoal(id, user);
        return ResponseEntity.noContent().build();
    }
}
