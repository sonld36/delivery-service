package com.mock.qlgiaohangback.repository;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.entity.ShopEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ShopRepository extends JpaRepository<ShopEntity, Long> {


    boolean existsByEmail(String email);

    ShopEntity findByAccount_Id(Long accountId);

    List<ShopEntity> findByStatus(Constans.ShopStatus status);

    @Query(value = "SELECT * FROM shops s WHERE s.id LIKE :id", nativeQuery = true)
    ShopEntity findShopById(@Param("id") Long id);


}
