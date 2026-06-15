package com.finance.tracker.repository;

import com.finance.tracker.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserIdOrderByExpenseDateDesc(Long userId);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.id = :userId")
    BigDecimal sumAmountByUserId(Long userId);

    @Query("SELECT e.category as category, SUM(e.amount) as total FROM Expense e WHERE e.user.id = :userId GROUP BY e.category")
    List<Object[]> sumByCategory(Long userId);

    @Query("SELECT MONTH(e.expenseDate) as month, YEAR(e.expenseDate) as year, SUM(e.amount) as total " +
           "FROM Expense e WHERE e.user.id = :userId GROUP BY YEAR(e.expenseDate), MONTH(e.expenseDate) ORDER BY YEAR(e.expenseDate), MONTH(e.expenseDate)")
    List<Object[]> monthlyExpenses(Long userId);
}
