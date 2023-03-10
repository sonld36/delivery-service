package com.mock.qlgiaohangback.repository;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.entity.OrderEntity;
import com.mock.qlgiaohangback.entity.OrderProductEntity;
import com.mock.qlgiaohangback.helpers.db.ICountOrderInThirtyDays;
import com.mock.qlgiaohangback.repository.custom.OrderRepoCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

public interface OrderRepository extends JpaRepository<OrderEntity, Long>, OrderRepoCustom {

    Page<OrderEntity> findAllByShopIdOrderByCreatedAtDesc(Long shopId, Pageable page);

    List<OrderEntity> findAll();

    List<OrderEntity> findOrderEntityByCarrier_IdOrderByIdDesc(Long shipper_id);

    OrderEntity findOrderEntityById(Long id);

    OrderEntity findOrderEntityByIdAndCarrier_Id(Long id, Long shipper_id);

    List<OrderEntity> findOrderEntityByStatus(Constans.OrderStatus status);

    List<OrderEntity> findOrderEntityByStatusAndCarrier_Id(Constans.OrderStatus status, Long shipper_id);

    List<OrderEntity> findOrderEntityByCustomer_Name(String name);

    List<OrderEntity> findOrderEntityByCustomer_NameAndCarrier_Id(String name, Long shipper_id);

    Page<OrderEntity> findByShopIdOrderByCreatedAtDesc(Long shopId, Pageable page);

    /*Hàm đếm số lượng đơn hàng trong ngày theo status và trong khoảng 30 ngày*/
    @Query(value = "SELECT COUNT(*) as countOrder, DATE(o.created_at) as dateCreate,  o.status as Status FROM `_orders` as o WHERE o.shop_id=:shopId AND o.created_at BETWEEN :startDate AND :endDate GROUP BY DATE(o.created_at), o.status ORDER BY DATE(o.created_at);", nativeQuery = true)
    List<ICountOrderInThirtyDays> countOrderInThirtyDays(@Param("startDate") String startDate, @Param("endDate") String endDate, @Param("shopId") Long shopId);

    @Query(value = "SELECT SUM(payment_total) FROM _orders WHERE status LIKE:status AND carrier_id =:shipper_id", nativeQuery = true)
    Integer statisticCODByStatus(@Param("status") String status, @Param("shipper_id") Long shipper_id);

    @Query(value = "SELECT SUM(ship_fee) FROM _orders WHERE status LIKE:status AND carrier_id =:shipper_id ", nativeQuery = true)
    Integer statisticShipFeeByStatus(@Param("status") String status, @Param("shipper_id") Long shipper_id);

    @Query(value = "SELECT SUM(payment_total) FROM _orders WHERE status = \"DONE\" AND carrier_id =:shipper_id AND completed_at >= :date", nativeQuery = true)
    Integer getRevenueToday(@Param("date") String date, @Param("shipper_id") Long shipper_id);

    @Query(value = "SELECT SUM(payment_total)  FROM _orders WHERE carrier_id =:shipper_id AND status = \"DONE\" AND completed_at >= :date and completed_at <= :nextDate", nativeQuery = true)
    Integer getRevenueByDate(@Param("date") String date, @Param("nextDate") String nextDate, @Param("shipper_id") Long shipper_id);

    @Query(value = "SELECT COUNT(id) FROM _orders WHERE status = \"DONE\" AND carrier_id =:shipper_id AND completed_at >= :date and completed_at <= :nextDate", nativeQuery = true)
    Integer countOrderDoneByDate(@Param("date") String date, @Param("nextDate") String nextDate, @Param("shipper_id") Long shipper_id);

    @Modifying
    @Transactional
    @Query(value = "UPDATE _orders SET status =:status WHERE carrier_id =:shipper_id AND id LIKE :id", nativeQuery = true)
    Integer changeStatus(@Param("id") String id, @Param("status") String status, @Param("shipper_id") Long shipper_id);

    @Modifying
    @Transactional
    @Query(value = "UPDATE _orders SET status = :status,completed_at=:completed_at WHERE carrier_id =:shipper_id AND id LIKE :id", nativeQuery = true)
    Integer changeStatusToSucessOrRefund(@Param("id") String id, @Param("shipper_id") Long shipper_id, @Param("status") String status, @Param("completed_at") String completed_at);

    // Repo cho điều phối
    //*Cần tạo truy vấn cho số lương đơn theo từng trạng thái trong thời gian 30 ngày gần nhất

    //Truy vấn ra số lượng đơn cho từng trạng thái đơn hàng
    @Query(value = "SELECT COUNT(*) from _orders WHERE status =:status", nativeQuery = true)
    Long countByStatus(@Param("status") String status);

    // Lấy mọi đơn hàng mọi trạng thái
    Page<OrderEntity> findAll(Pageable pageable);

    //Lấy  tổng số lượng bản ghi
    @Query(value = "SELECT COUNT(*) from _orders", nativeQuery = true)
    Long countAllOrder();

    // Lấy mọi đơn hàng theo trạng thái
    Page<OrderEntity> findAllByStatus(Constans.OrderStatus status, Pageable pageable);

    //Lấy thông tin gửi nhận cho đơn hàng
    OrderEntity findOrderRespInfDetailById(Long id);

    //Cập nhật/ Gán nhân viên giao hàng cho đơn hàng và chuyển trạng thái
    @Modifying
    @Transactional
    @Query(value = "UPDATE _orders SET STATUS = :status,carrier_id = :carrierId, modified_at = :modifiedAt where id = :orderId", nativeQuery = true)
    Integer updateCarrierIdAndStatus(@Param("status") String status, @Param("carrierId") Long carrierId, @Param("orderId") Long orderId, @Param("modifiedAt") Date modifiedAt);

    @Query(value="SELECT * FROM _orders o WHERE o.shop_id LIKE :id",nativeQuery = true)
    List<OrderEntity> findOrderEntytyByShopId(@Param("id") Long id);

}
