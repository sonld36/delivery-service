package com.mock.qlgiaohangback.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.dto.cod.CODByDateAndShopId;
import com.mock.qlgiaohangback.dto.order.*;
import com.mock.qlgiaohangback.entity.AccountEntity;
import com.mock.qlgiaohangback.entity.OrderEntity;

import java.text.ParseException;
import java.util.Date;
import java.util.List;
import java.util.Map;

public interface IOrderService {
    List<OrderRespDTO> getAll();

    OrderRespDTO getOrderById(Long id);

    List<OrderRespDTO> getOrderByStatus(Constans.OrderStatus status);

    List<OrderRespDTO> getOrderByCustomerName(String name);

    OrderRespWithPagingDTO getOrderNewest(int page);

    List<OrderRespDTO> getAllByShipperId();

    List<OrderRespDTO> getAllByShipperId(Long shipperId);


    OrderRespDTO getOrderByIdAndShipperId(Long id);

    List<OrderRespDTO> getOrderByStatusAndShipperId(Constans.OrderStatus status);

    List<OrderRespDTO> getOrderByStatusAndShipperId(Constans.OrderStatus status, Long shipperId);

    List<OrderRespDTO> getOrderByCustomerNameAndShipperId(String name);

    List<CountOrderByStatusDTO> countOrderByStatus();

    Integer countOrderDoneByDate(String date, String nextDate);

    Integer statisticCODByStatus(String status);

    Integer statisticShipFeeByStatus(String status);

    Integer getRevenueByDate(String date, String nextDate);

    Integer getRevenueToday();

    Integer changeStatus(String id, Constans.OrderStatus status) throws JsonProcessingException;

    Boolean createOrder(OrderCreateDTO orderCreateDTO) throws JsonProcessingException;

    OrderRespWithPagingDTO getOrderWithPaging(int page);

    // Trả về trạng thái và số lượng của điều phối
    Map<Constans.OrderStatus, Long> countByStatus();

    // Trả về các đơn hàng theo mọi trạng thái
    OrderRespoDPhoiWithPagingDTO findAllOrder(int pageIndex) throws Exception;

    OrderRespoDPhoiWithPagingDTO findAllOrderStatus(int pageIndex, Constans.OrderStatus status) throws Exception;

    OrderRespInfDetailDTO findOrderRespInfDetailById(Long orderId);


    Integer cancelOrder(Long orderId) throws JsonProcessingException;

    List<OrderRespDTO> getOrderByDateAndCarrierId(String date, Long id) throws ParseException;

    List<OrderRespDTO> getOrderByDateAndShopId(CODByDateAndShopId cod);

    List<OrderRespDTO> getOrderByShopId(Long id);

    List<OrderEntity> updateOrderIsPaid(OrderByDateAndListId order);

    List<CountOrderByRangeDateDTO> getOrderInThirtyDays(String startDate, String endDate);

    List<OrderRespDTO> getOrderNotDoneYet();

    Integer assignCarrier(Long orderId, Long carrierId) throws Exception;

    OrderRespProductDetailInfDTO findAllProductOrderById(Long orderId) throws Exception;

    Integer countByCarrierAndStatus(AccountEntity account, Constans.OrderStatus status);

    Integer getPageByOrderId(long orderId);

    List<OrderEntity> getByCarrierIdAndListStatus(long carrierId, List<Constans.OrderStatus> statuses);

    int takeOrder(long orderId) throws JsonProcessingException;

    List<CountOrderByRangeDateDTO> getInAWeekByCarrier();

}
