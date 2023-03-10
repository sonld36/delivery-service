package com.mock.qlgiaohangback.repository;

import com.mock.qlgiaohangback.entity.OrderProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface OrderProductRepository extends JpaRepository<OrderProductEntity, Long> {
    //Lấy danh sách sản phẩm chi tiết của đơn
    List<OrderProductEntity> findByOrderId(Long orderId);
}
