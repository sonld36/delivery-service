package com.mock.qlgiaohangback.repository;

import com.mock.qlgiaohangback.entity.ProductEntity;
import com.mock.qlgiaohangback.helpers.db.ICountProductQuantityWithStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<ProductEntity, Long> {
    ProductEntity findByName(String name);

    Page<ProductEntity> findByShopIdOrderByCreatedAt(Long shopId, Pageable page);

    Optional<ProductEntity> findById(Long id);

    void deleteById(Long id);

    List<ProductEntity> searchByNameContainsIgnoreCaseAndActiveTrueAndShopId(String name, Long shopId);

    @Query(value = "SELECT * FROM products as p WHERE p.shop_id=:shopId AND p.id in (select sp.id from products as sp WHERE sp.name=:name OR sp.product_code=:productCode)", nativeQuery = true)
    List<ProductEntity> getByNameOrProductCode(@Param("name") String name, @Param("productCode") String productCode, @Param("shopId") Long shopId);

    @Query(value = "SELECT tb1.sum as totalByStatus, tb1.status as status, tb2.pid as productId, p.name as productName FROM (SELECT SUM(op.product_quantity) as sum, op.product_id as pid, o.status FROM _orders o left JOIN orders_products op ON o.id = op.order_id\n" +
            "WHERE o.shop_id=:shopId AND o.created_at BETWEEN :startDate AND :endDate GROUP BY o.status, pid) as tb1 right JOIN (SELECT SUM(op.product_quantity) as sum, op.product_id as pid FROM _orders o left JOIN orders_products op ON o.id = op.order_id\n" +
            "WHERE o.shop_id=:shopId AND o.created_at BETWEEN :startDate AND :endDate GROUP BY op.product_id ORDER BY sum DESC LIMIT 10) as tb2 ON tb1.pid = tb2.pid left JOIN products p ON tb1.pid = p.id", nativeQuery = true)
    List<ICountProductQuantityWithStatus> getTop10ProductInDateRange(@Param("startDate") String startDate, @Param("endDate") String endDate, @Param("shopId") Long shopId);


}
