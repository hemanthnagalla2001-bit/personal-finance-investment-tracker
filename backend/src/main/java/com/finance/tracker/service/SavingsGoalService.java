package com.finance.tracker.service;

import com.finance.tracker.dto.SavingsGoalDTO;
import com.finance.tracker.entity.SavingsGoal;
import com.finance.tracker.entity.User;
import com.finance.tracker.exception.ResourceNotFoundException;
import com.finance.tracker.repository.SavingsGoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavingsGoalService {

    private final SavingsGoalRepository savingsGoalRepository;

    public List<SavingsGoalDTO> getAllGoals(User user) {
        return savingsGoalRepository.findByUserIdOrderByTargetDateAsc(user.getId())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public SavingsGoalDTO createGoal(SavingsGoalDTO dto, User user) {
        SavingsGoal goal = SavingsGoal.builder()
                .user(user)
                .goalName(dto.getGoalName())
                .targetAmount(dto.getTargetAmount())
                .currentAmount(dto.getCurrentAmount() != null ? dto.getCurrentAmount() : BigDecimal.ZERO)
                .targetDate(dto.getTargetDate())
                .build();
        return toDTO(savingsGoalRepository.save(goal));
    }

    public SavingsGoalDTO updateGoal(Long id, SavingsGoalDTO dto, User user) {
        SavingsGoal goal = getGoalForUser(id, user);
        goal.setGoalName(dto.getGoalName());
        goal.setTargetAmount(dto.getTargetAmount());
        goal.setCurrentAmount(dto.getCurrentAmount() != null ? dto.getCurrentAmount() : BigDecimal.ZERO);
        goal.setTargetDate(dto.getTargetDate());
        return toDTO(savingsGoalRepository.save(goal));
    }

    public void deleteGoal(Long id, User user) {
        SavingsGoal goal = getGoalForUser(id, user);
        savingsGoalRepository.delete(goal);
    }

    public SavingsGoalDTO getGoalById(Long id, User user) {
        return toDTO(getGoalForUser(id, user));
    }

    private SavingsGoal getGoalForUser(Long id, User user) {
        SavingsGoal goal = savingsGoalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Savings goal not found with id: " + id));
        if (!goal.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Savings goal not found with id: " + id);
        }
        return goal;
    }

    private SavingsGoalDTO toDTO(SavingsGoal goal) {
        SavingsGoalDTO dto = new SavingsGoalDTO();
        dto.setId(goal.getId());
        dto.setGoalName(goal.getGoalName());
        dto.setTargetAmount(goal.getTargetAmount());
        dto.setCurrentAmount(goal.getCurrentAmount());
        dto.setTargetDate(goal.getTargetDate());
        return dto;
    }
}
