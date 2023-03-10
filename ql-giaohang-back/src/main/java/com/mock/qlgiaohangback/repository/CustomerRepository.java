package com.mock.qlgiaohangback.repository;

import com.mock.qlgiaohangback.entity.CustomerEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<CustomerEntity, Long> {
    Page<CustomerEntity> findByShopIdOrderByCreatedAt(Long shopId, Pageable page);

    @Override
    CustomerEntity save(CustomerEntity entity);

    Optional<CustomerEntity> findByPhoneNumber(String phoneNumber);

    boolean existsByPhoneNumberAndShopId(String phoneNumber, Long shopId);

    List<CustomerEntity> findByPhoneNumberContainingAndShop_Id(String phoneNumber, Long shopId);

    Optional<CustomerEntity> findById(Long id);

    void deleteById(Long id);
}
