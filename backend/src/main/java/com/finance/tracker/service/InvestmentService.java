package com.finance.tracker.service;

import com.finance.tracker.dto.InvestmentDTO;
import com.finance.tracker.entity.Investment;
import com.finance.tracker.entity.User;
import com.finance.tracker.exception.ResourceNotFoundException;
import com.finance.tracker.repository.InvestmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvestmentService {

    private final InvestmentRepository investmentRepository;

    public List<InvestmentDTO> getAllInvestments(User user) {
        return investmentRepository.findByUserIdOrderByPurchaseDateDesc(user.getId())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public InvestmentDTO createInvestment(InvestmentDTO dto, User user) {
        Investment investment = Investment.builder()
                .user(user)
                .investmentName(dto.getInvestmentName())
                .assetType(dto.getAssetType())
                .quantity(dto.getQuantity())
                .purchasePrice(dto.getPurchasePrice())
                .currentValue(dto.getCurrentValue())
                .purchaseDate(dto.getPurchaseDate())
                .build();
        return toDTO(investmentRepository.save(investment));
    }

    public InvestmentDTO updateInvestment(Long id, InvestmentDTO dto, User user) {
        Investment investment = getInvestmentForUser(id, user);
        investment.setInvestmentName(dto.getInvestmentName());
        investment.setAssetType(dto.getAssetType());
        investment.setQuantity(dto.getQuantity());
        investment.setPurchasePrice(dto.getPurchasePrice());
        investment.setCurrentValue(dto.getCurrentValue());
        investment.setPurchaseDate(dto.getPurchaseDate());
        return toDTO(investmentRepository.save(investment));
    }

    public void deleteInvestment(Long id, User user) {
        Investment investment = getInvestmentForUser(id, user);
        investmentRepository.delete(investment);
    }

    public InvestmentDTO getInvestmentById(Long id, User user) {
        return toDTO(getInvestmentForUser(id, user));
    }

    private Investment getInvestmentForUser(Long id, User user) {
        Investment investment = investmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Investment not found with id: " + id));
        if (!investment.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Investment not found with id: " + id);
        }
        return investment;
    }

    private InvestmentDTO toDTO(Investment investment) {
        InvestmentDTO dto = new InvestmentDTO();
        dto.setId(investment.getId());
        dto.setInvestmentName(investment.getInvestmentName());
        dto.setAssetType(investment.getAssetType());
        dto.setQuantity(investment.getQuantity());
        dto.setPurchasePrice(investment.getPurchasePrice());
        dto.setCurrentValue(investment.getCurrentValue());
        dto.setPurchaseDate(investment.getPurchaseDate());
        return dto;
    }
}
