package com.finance.tracker.service;

import com.finance.tracker.dto.ExpenseDTO;
import com.finance.tracker.entity.Expense;
import com.finance.tracker.entity.User;
import com.finance.tracker.exception.ResourceNotFoundException;
import com.finance.tracker.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public List<ExpenseDTO> getAllExpenses(User user) {
        return expenseRepository.findByUserIdOrderByExpenseDateDesc(user.getId())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ExpenseDTO createExpense(ExpenseDTO dto, User user) {
        Expense expense = Expense.builder()
                .user(user)
                .title(dto.getTitle())
                .category(dto.getCategory())
                .amount(dto.getAmount())
                .expenseDate(dto.getExpenseDate())
                .notes(dto.getNotes())
                .build();
        return toDTO(expenseRepository.save(expense));
    }

    public ExpenseDTO updateExpense(Long id, ExpenseDTO dto, User user) {
        Expense expense = getExpenseForUser(id, user);
        expense.setTitle(dto.getTitle());
        expense.setCategory(dto.getCategory());
        expense.setAmount(dto.getAmount());
        expense.setExpenseDate(dto.getExpenseDate());
        expense.setNotes(dto.getNotes());
        return toDTO(expenseRepository.save(expense));
    }

    public void deleteExpense(Long id, User user) {
        Expense expense = getExpenseForUser(id, user);
        expenseRepository.delete(expense);
    }

    public ExpenseDTO getExpenseById(Long id, User user) {
        return toDTO(getExpenseForUser(id, user));
    }

    private Expense getExpenseForUser(Long id, User user) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
        if (!expense.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Expense not found with id: " + id);
        }
        return expense;
    }

    private ExpenseDTO toDTO(Expense expense) {
        ExpenseDTO dto = new ExpenseDTO();
        dto.setId(expense.getId());
        dto.setTitle(expense.getTitle());
        dto.setCategory(expense.getCategory());
        dto.setAmount(expense.getAmount());
        dto.setExpenseDate(expense.getExpenseDate());
        dto.setNotes(expense.getNotes());
        return dto;
    }
}
