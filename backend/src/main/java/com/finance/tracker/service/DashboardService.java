package com.finance.tracker.service;

import com.finance.tracker.dto.DashboardSummaryDTO;
import com.finance.tracker.entity.User;
import com.finance.tracker.repository.ExpenseRepository;
import com.finance.tracker.repository.IncomeRepository;
import com.finance.tracker.repository.InvestmentRepository;
import com.finance.tracker.repository.SavingsGoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final InvestmentRepository investmentRepository;
    private final SavingsGoalRepository savingsGoalRepository;

    public DashboardSummaryDTO getSummary(User user) {
        Long userId = user.getId();

        BigDecimal totalIncome = Optional.ofNullable(incomeRepository.sumAmountByUserId(userId))
                .orElse(BigDecimal.ZERO);
        BigDecimal totalExpenses = Optional.ofNullable(expenseRepository.sumAmountByUserId(userId))
                .orElse(BigDecimal.ZERO);
        BigDecimal netSavings = totalIncome.subtract(totalExpenses);
        BigDecimal totalInvestmentValue = Optional.ofNullable(investmentRepository.sumCurrentValueByUserId(userId))
                .orElse(BigDecimal.ZERO);

        // Expenses by category
        Map<String, BigDecimal> expensesByCategory = new LinkedHashMap<>();
        expenseRepository.sumByCategory(userId).forEach(row -> {
            expensesByCategory.put((String) row[0], (BigDecimal) row[1]);
        });

        // Investments by asset type
        Map<String, BigDecimal> investmentsByAssetType = new LinkedHashMap<>();
        investmentRepository.sumByAssetType(userId).forEach(row -> {
            investmentsByAssetType.put((String) row[0], (BigDecimal) row[1]);
        });

        // Savings goal progress
        List<DashboardSummaryDTO.SavingsGoalProgressDTO> goalProgress = savingsGoalRepository
                .findByUserIdOrderByTargetDateAsc(userId).stream()
                .map(goal -> {
                    double percent = goal.getTargetAmount().compareTo(BigDecimal.ZERO) > 0
                            ? goal.getCurrentAmount()
                                .divide(goal.getTargetAmount(), 4, RoundingMode.HALF_UP)
                                .multiply(BigDecimal.valueOf(100))
                                .doubleValue()
                            : 0.0;
                    return DashboardSummaryDTO.SavingsGoalProgressDTO.builder()
                            .goalName(goal.getGoalName())
                            .targetAmount(goal.getTargetAmount())
                            .currentAmount(goal.getCurrentAmount())
                            .progressPercentage(Math.min(percent, 100.0))
                            .build();
                }).collect(Collectors.toList());

        // Monthly income/expense data
        Map<String, BigDecimal> monthlyIncome = new LinkedHashMap<>();
        incomeRepository.monthlyIncomes(userId).forEach(row -> {
            String key = row[1] + "-" + String.format("%02d", ((Number) row[0]).intValue());
            monthlyIncome.put(key, (BigDecimal) row[2]);
        });

        Map<String, BigDecimal> monthlyExpense = new LinkedHashMap<>();
        expenseRepository.monthlyExpenses(userId).forEach(row -> {
            String key = row[1] + "-" + String.format("%02d", ((Number) row[0]).intValue());
            monthlyExpense.put(key, (BigDecimal) row[2]);
        });

        Set<String> allMonths = new TreeSet<>();
        allMonths.addAll(monthlyIncome.keySet());
        allMonths.addAll(monthlyExpense.keySet());

        List<DashboardSummaryDTO.MonthlyDataDTO> monthlyData = allMonths.stream().map(key -> {
            String[] parts = key.split("-");
            return DashboardSummaryDTO.MonthlyDataDTO.builder()
                    .year(Integer.parseInt(parts[0]))
                    .month(Integer.parseInt(parts[1]))
                    .income(monthlyIncome.getOrDefault(key, BigDecimal.ZERO))
                    .expense(monthlyExpense.getOrDefault(key, BigDecimal.ZERO))
                    .build();
        }).collect(Collectors.toList());

        return DashboardSummaryDTO.builder()
                .totalIncome(totalIncome)
                .totalExpenses(totalExpenses)
                .netSavings(netSavings)
                .totalInvestmentValue(totalInvestmentValue)
                .savingsGoalProgress(goalProgress)
                .expensesByCategory(expensesByCategory)
                .monthlyIncomeExpense(monthlyData)
                .investmentsByAssetType(investmentsByAssetType)
                .build();
    }
}
