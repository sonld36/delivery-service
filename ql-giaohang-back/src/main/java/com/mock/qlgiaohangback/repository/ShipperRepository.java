package com.mock.qlgiaohangback.repository;

import com.mock.qlgiaohangback.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ShipperRepository extends JpaRepository<OrderEntity, Long> {
}
