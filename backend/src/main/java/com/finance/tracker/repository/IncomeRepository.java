package com.finance.tracker.repository;

import com.finance.tracker.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByUserIdOrderByIncomeDateDesc(Long userId);

    @Query("SELECT SUM(i.amount) FROM Income i WHERE i.user.id = :userId")
    BigDecimal sumAmountByUserId(Long userId);

    @Query("SELECT MONTH(i.incomeDate) as month, YEAR(i.incomeDate) as year, SUM(i.amount) as total " +
           "FROM Income i WHERE i.user.id = :userId GROUP BY YEAR(i.incomeDate), MONTH(i.incomeDate) ORDER BY YEAR(i.incomeDate), MONTH(i.incomeDate)")
    List<Object[]> monthlyIncomes(Long userId);
}
