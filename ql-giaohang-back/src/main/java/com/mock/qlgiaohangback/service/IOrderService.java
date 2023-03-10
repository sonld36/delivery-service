package com.mock.qlgiaohangback.service;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.dto.cod.CODByDateAndShopId;
import com.mock.qlgiaohangback.dto.order.*;
import com.mock.qlgiaohangback.entity.OrderEntity;

import java.util.List;
import java.util.Map;

public interface IOrderService {
    List<OrderRespDTO> getAll();

    OrderRespDTO getOrderById(Long id);

    List<OrderRespDTO> getOrderByStatus(Constans.OrderStatus status);

    List<OrderRespDTO> getOrderByCustomerName(String name);

    OrderRespWithPagingDTO getOrderNewest(int page);

    List<OrderRespDTO> getAllByShipperId();

    OrderRespDTO getOrderByIdAndShipperId(Long id);

    List<OrderRespDTO> getOrderByStatusAndShipperId(Constans.OrderStatus status);

    List<OrderRespDTO> getOrderByCustomerNameAndShipperId(String name);

    List<CountOrderByStatusDTO> countOrderByStatus();

    Integer countOrderDoneByDate(String date, String nextDate);

    Integer statisticCODByStatus(String status);

    Integer statisticShipFeeByStatus(String status);

    Integer getRevenueByDate(String date, String nextDate);

    Integer getRevenueToday();

    Integer changeStatus(String id, String status);

    Boolean createOrder(OrderCreateDTO orderCreateDTO);

    OrderRespWithPagingDTO getOrderWithPaging(int page);

    // Trả về trạng thái và số lượng của điều phối
    Map<Constans.OrderStatus, Long> countByStatus();

    // Trả về các đơn hàng theo mọi trạng thái
    OrderRespoDPhoiWithPagingDTO findAllOrder(String pageIndex, String pageSize) throws Exception;

    OrderRespoDPhoiWithPagingDTO findAllOrderStatus(String pageIndex, String pageSize, Constans.OrderStatus status) throws Exception;

    OrderRespInfDetailDTO findOrderRespInfDetailById(Long orderId);


    Integer cancelOrder(Long orderId);

    List<OrderRespDTO> getOrderByDateAndCarrierId(OrderByDateAndCarrierId order);

    List<OrderRespDTO> getOrderByDateAndShopId(CODByDateAndShopId cod);

    List<OrderRespDTO> getOrderByShopId(Long id);

    List<OrderEntity> updateOrderIsPaid(OrderByDateAndListId order);

    List<CountOrderByRangeDateDTO> getOrderInThirtyDays(String startDate, String endDate);

    List<OrderRespDTO> getOrderNotDoneYet();

    Integer assignCarrier(Long orderId, String carrierId) throws Exception;

    OrderRespProductDetailInfDTO findAllProductOrderById(Long orderId) throws Exception;
}
