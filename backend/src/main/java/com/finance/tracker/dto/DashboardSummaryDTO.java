package com.finance.tracker.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardSummaryDTO {
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal netSavings;
    private BigDecimal totalInvestmentValue;
    private List<SavingsGoalProgressDTO> savingsGoalProgress;
    private Map<String, BigDecimal> expensesByCategory;
    private List<MonthlyDataDTO> monthlyIncomeExpense;
    private Map<String, BigDecimal> investmentsByAssetType;

    @Data
    @Builder
    public static class SavingsGoalProgressDTO {
        private String goalName;
        private BigDecimal targetAmount;
        private BigDecimal currentAmount;
        private double progressPercentage;
    }

    @Data
    @Builder
    public static class MonthlyDataDTO {
        private int year;
        private int month;
        private BigDecimal income;
        private BigDecimal expense;
    }
}
