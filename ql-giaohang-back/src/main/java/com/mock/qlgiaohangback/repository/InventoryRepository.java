package com.mock.qlgiaohangback.repository;

import com.mock.qlgiaohangback.entity.InventoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<InventoryEntity, Long> {
    Optional<List<InventoryEntity>> findAllByActiveTrue();
}
