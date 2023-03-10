package com.mock.qlgiaohangback.repository;

import com.mock.qlgiaohangback.entity.CODEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CODRepository extends JpaRepository<CODEntity, Long> {

    @Query(value = "SELECT * FROM cod c WHERE c.shop_id LIKE :id", nativeQuery = true)
    List<CODEntity> findCODByShopId(@Param("id") Long id);

    Page<CODEntity> findByShopIdAndStatusOrderByCreatedAt(Long shopId, Integer status, Pageable page);

    Optional<CODEntity> findById(Long id);

    @Query(value = "SELECT * FROM cod c WHERE c.shop_id = :shopId AND (c.status = :status OR c.status = :status2)", nativeQuery = true)
    Page<CODEntity> getByShopIdAndStatusEqualsOrStatusEquals(@Param("shopId") Long shopId,@Param("status") Integer status,@Param("status2") Integer status2, Pageable pageable);
}
