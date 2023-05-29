package com.mock.qlgiaohangback.repository;

import com.mock.qlgiaohangback.entity.AccountEntity;
import com.mock.qlgiaohangback.entity.OrderProcessLogEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderProcessLogRepository extends JpaRepository<OrderProcessLogEntity, Long> {
    Page<OrderProcessLogEntity> findAllByOrderByCreatedAtDesc(Pageable page);

    Page<OrderProcessLogEntity> findAllByOrder_ShopAccountOrderByCreatedAtDesc(AccountEntity shop, Pageable page);
}
