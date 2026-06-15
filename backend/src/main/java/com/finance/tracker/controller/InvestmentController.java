package com.finance.tracker.controller;

import com.finance.tracker.dto.InvestmentDTO;
import com.finance.tracker.entity.User;
import com.finance.tracker.service.InvestmentService;
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
@RequestMapping("/api/investments")
@RequiredArgsConstructor
public class InvestmentController {

    private final InvestmentService investmentService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<InvestmentDTO>> getAllInvestments(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(investmentService.getAllInvestments(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvestmentDTO> getInvestmentById(@PathVariable Long id,
                                                            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(investmentService.getInvestmentById(id, user));
    }

    @PostMapping
    public ResponseEntity<InvestmentDTO> createInvestment(@Valid @RequestBody InvestmentDTO dto,
                                                           @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(investmentService.createInvestment(dto, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InvestmentDTO> updateInvestment(@PathVariable Long id,
                                                           @Valid @RequestBody InvestmentDTO dto,
                                                           @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(investmentService.updateInvestment(id, dto, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvestment(@PathVariable Long id,
                                                  @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        investmentService.deleteInvestment(id, user);
        return ResponseEntity.noContent().build();
    }
}
