package com.mock.qlgiaohangback.repository;

import com.mock.qlgiaohangback.entity.CarrierEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CarrierRepository extends JpaRepository<CarrierEntity, Long> {
    Optional<CarrierEntity> findById(Long id);

    Page<CarrierEntity> findAll(Pageable page);

    List<CarrierEntity> findByIsActiveTrueAndAvailableTrue();

    Optional<CarrierEntity> findByAccount_Id(long accountId);

}
