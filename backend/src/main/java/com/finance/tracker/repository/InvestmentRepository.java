package com.finance.tracker.repository;

import com.finance.tracker.entity.Investment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, Long> {
    List<Investment> findByUserIdOrderByPurchaseDateDesc(Long userId);

    @Query("SELECT SUM(i.currentValue) FROM Investment i WHERE i.user.id = :userId")
    BigDecimal sumCurrentValueByUserId(Long userId);

    @Query("SELECT i.assetType as assetType, SUM(i.currentValue) as total FROM Investment i WHERE i.user.id = :userId GROUP BY i.assetType")
    List<Object[]> sumByAssetType(Long userId);
}
