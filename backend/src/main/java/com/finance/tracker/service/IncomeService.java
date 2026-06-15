package com.finance.tracker.service;

import com.finance.tracker.dto.IncomeDTO;
import com.finance.tracker.entity.Income;
import com.finance.tracker.entity.User;
import com.finance.tracker.exception.ResourceNotFoundException;
import com.finance.tracker.repository.IncomeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncomeService {

    private final IncomeRepository incomeRepository;

    public List<IncomeDTO> getAllIncomes(User user) {
        return incomeRepository.findByUserIdOrderByIncomeDateDesc(user.getId())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public IncomeDTO createIncome(IncomeDTO dto, User user) {
        Income income = Income.builder()
                .user(user)
                .source(dto.getSource())
                .amount(dto.getAmount())
                .incomeDate(dto.getIncomeDate())
                .notes(dto.getNotes())
                .build();
        return toDTO(incomeRepository.save(income));
    }

    public IncomeDTO updateIncome(Long id, IncomeDTO dto, User user) {
        Income income = getIncomeForUser(id, user);
        income.setSource(dto.getSource());
        income.setAmount(dto.getAmount());
        income.setIncomeDate(dto.getIncomeDate());
        income.setNotes(dto.getNotes());
        return toDTO(incomeRepository.save(income));
    }

    public void deleteIncome(Long id, User user) {
        Income income = getIncomeForUser(id, user);
        incomeRepository.delete(income);
    }

    public IncomeDTO getIncomeById(Long id, User user) {
        return toDTO(getIncomeForUser(id, user));
    }

    private Income getIncomeForUser(Long id, User user) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Income not found with id: " + id));
        if (!income.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Income not found with id: " + id);
        }
        return income;
    }

    private IncomeDTO toDTO(Income income) {
        IncomeDTO dto = new IncomeDTO();
        dto.setId(income.getId());
        dto.setSource(income.getSource());
        dto.setAmount(income.getAmount());
        dto.setIncomeDate(income.getIncomeDate());
        dto.setNotes(income.getNotes());
        return dto;
    }
}
