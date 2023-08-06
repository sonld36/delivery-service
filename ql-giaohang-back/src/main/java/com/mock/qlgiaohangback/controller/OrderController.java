package com.mock.qlgiaohangback.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.common.ResponseHandler;
import com.mock.qlgiaohangback.dto.cod.CODByDateAndShopId;
import com.mock.qlgiaohangback.dto.order.OrderByDateAndCarrierId;
import com.mock.qlgiaohangback.dto.order.OrderByDateAndListId;
import com.mock.qlgiaohangback.dto.order.OrderCreateDTO;
import com.mock.qlgiaohangback.service.IOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.text.ParseException;
import java.util.Date;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderController  {
    private final IOrderService orderService;


    @Secured(value = "ROLE_SHOP")
    @PostMapping
    public ResponseEntity createOrder(@RequestBody @Valid OrderCreateDTO orderCreateDTO) throws JsonProcessingException {
        return ResponseHandler.generateResponse(MessageResponse.CREATED_SUCCESS,
                Constans.Code.CREATED_SUCCESS.getCode(),
                HttpStatus.CREATED,
                this.orderService.createOrder(orderCreateDTO));
    }

    @PutMapping(value = "/take-order/{id}")
    public ResponseEntity carrierTakeOrder(@PathVariable("id") long orderId) {
        return ResponseHandler.generateResponse(MessageResponse.UPDATE_SUCCESS,
                Constans.Code.TAKE_A_ORDER_SUCCESSFUL.getCode(),
                HttpStatus.OK,
                this.orderService.takeOrder(orderId)
                );
    }

    //  API order chung
    @GetMapping("")
    public ResponseEntity getAll() {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.getAll());
    }

    @GetMapping(params = {"startDate", "endDate"})
    public ResponseEntity getOrderInThirtyDays(@RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.getOrderInThirtyDays(startDate, endDate));
    }

    @GetMapping("/week-recent")
    public ResponseEntity getNumberOfOrderInWeekRecent() {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.getInAWeekByCarrier());
    }

    @GetMapping("sort")
    public ResponseEntity getOrderNewest(@RequestParam int page) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.getOrderNewest(page));
    }

    @GetMapping("not-done-yet")
    public ResponseEntity getOrdersNotDoneYet() {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.getOrderNotDoneYet());
    }

    @GetMapping("/paging")
    public ResponseEntity getAllWithPaging(@RequestParam int page) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.getOrderWithPaging(page));
    }

    @GetMapping("/{id}")
    public ResponseEntity getOrderById(@PathVariable Long id) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.getOrderById(id));
    }

    @GetMapping("/status={status}")
    public ResponseEntity getOrderByStatus(@PathVariable Constans.OrderStatus status) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.getOrderByStatus(status));
    }

    @GetMapping("/search/{name}")
    public ResponseEntity getOrderByCustomerName(@PathVariable String name) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.getOrderByCustomerName(name));
    }


    //  API dành cho SHIPPER gọi order
    @GetMapping("/shipper")
    public ResponseEntity getAllByShipperId() {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.getAllByShipperId());
    }

    @GetMapping("/shipper/id")
    public ResponseEntity getOrderByIdAndShipperId(@RequestParam("id") Long id) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.getOrderByIdAndShipperId(id));
    }

    @GetMapping("/shipper/status")
    public ResponseEntity getOrderByStatusAndShipperId(@RequestParam("status") Constans.OrderStatus status) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.getOrderByStatusAndShipperId(status));
    }

    @GetMapping("/shipper/search")
    public ResponseEntity getOrderByCustomerNameAndShipperId(@RequestParam("name") String name) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.getOrderByCustomerNameAndShipperId(name));
    }

    @GetMapping("/shipper/count-by-status")
    public ResponseEntity countOrderByStatus() {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.countOrderByStatus());
    }

    @GetMapping("/shipper/count-by-date")
    public ResponseEntity countOrderDoneByDate(@RequestParam("date") String date, @RequestParam("nextDate") String nextDate) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.countOrderDoneByDate(date, nextDate));
    }

    @GetMapping("/shipper/statistic/cod")
    public ResponseEntity statisticCODByStatus(@RequestParam("status") String status) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.statisticCODByStatus(status));
    }

    @GetMapping("/shipper/statistic/ship_fee")
    public ResponseEntity statisticShipFeeByStatus(@RequestParam("status") String status) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.statisticShipFeeByStatus(status));
    }

    @GetMapping("/shipper/statistic/revenue")
    public ResponseEntity getRevenueToday() {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.getRevenueToday());
    }

    @GetMapping("/shipper/statistic/revenue-by-date")
    public ResponseEntity getRevenueByDate(@RequestParam("date") String date, @RequestParam("nextDate") String nextDate) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.getRevenueByDate(date, nextDate));
    }

    // @PutMapping("/shipper/change-status")
    // public ResponseEntity changeStatus(@RequestParam(required=false,name="id") String id,@RequestParam(required=false,name="status") String status) {
    //     return ResponseHandler.generateResponse(MessageResponse.FOUND,
    //             Constans.Code.OK.getCode(),
    //             HttpStatus.OK,
    //             this.orderService.changeStatus(id,status));
    // }
    @PutMapping(value = "/shipper/change-status", params = {"id", "status"})
    public ResponseEntity changeStatus(@RequestParam("id") String id, @RequestParam("status") Constans.OrderStatus status) throws JsonProcessingException {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.changeStatus(id, status));
    }
    //API cho điều phối

    //Trả về số lượng đơn theo trạng thái
    @GetMapping("/dieu-phoi/count-by-status")
    public ResponseEntity countByStatus() {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.countByStatus());

    }

    @GetMapping("/dieu-phoi/get-all-order")
    //   http://localhost:8080/api/order/dieu-phoi/get-all-order@pageIndex=&pageSize=
    public ResponseEntity getAllOrders(@RequestParam(value = "page") int page) throws Exception {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.findAllOrder(page));

    }

    @GetMapping("/dieu-phoi/get-all-order-by-status")
    //   http://localhost:8080/api/order/dieu-phoi/get-all-order@pageIndex=&pageSize=&status=
    public ResponseEntity getAllOrdersByStatus(@RequestParam(value = "page") int page,
                                               @RequestParam(value = "status") Constans.OrderStatus status) throws Exception {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.findAllOrderStatus(page, status));
    }

    @GetMapping("/dieu-phoi/order-info-detail")
    //   http://localhost:8080/api/order/dieu-phoi/order-info-detail?orderId=
    public ResponseEntity getAllOrdersByStatus(@RequestParam(value = "orderId") Long orderId) throws Exception {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.findOrderRespInfDetailById(orderId));
    }
    @PutMapping("/dieu-phoi/assign-carrier")
    //    http://localhost:8080/api/order/dieu-phoi/assign-carrier?orderId=&carrierId=
    public ResponseEntity assignCarrier(@RequestParam Long orderId, @RequestParam Long carrierId) throws Exception {
        return ResponseHandler.generateResponse(MessageResponse.UPDATE_SUCCESS,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.assignCarrier(orderId,carrierId));
    }
    //Lấy danh sách sản phẩm theo id đơn hàng
    @GetMapping("/dieu-phoi/get-product-list-by-orderId")
    //   http://localhost:8080/api/order/dieu-phoi/get-product-list-by-orderId@orderId=
    public ResponseEntity findAllProductOrderById(@RequestParam(value = "orderId") Long orderId) throws Exception {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.findAllProductOrderById(orderId));
    }

    @GetMapping(value = "/count-by-status", params = {"status", "carrierId"})
    public ResponseEntity countOrderByStatusAndCarrierId(@RequestParam("status")Constans.OrderStatus status, @RequestParam("carrierId") Long carrierId) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService
                );
    }

    @Secured(value = {"ROLE_COORDINATOR", "ROLE_SHOP"} )
    @DeleteMapping("/{id}")
    public ResponseEntity cancelOrder(@PathVariable Long id) {
        return ResponseHandler.generateResponse(MessageResponse.DELETE_SUCCESS,
                Constans.Code.DELETE_SUCCESSFUL.getCode(),
                HttpStatus.ACCEPTED,
                this.orderService.cancelOrder(id));
    }

    @GetMapping(params = {"date", "carrierId"})
    public ResponseEntity gitOrdersByAbove(@RequestParam("date") String date, @RequestParam("carrierId") Long id) throws ParseException {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.getOrderByDateAndCarrierId(date, id));
    }

    @PostMapping("/paid")
    public ResponseEntity updateOrderPaid(@RequestBody OrderByDateAndListId body) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.updateOrderIsPaid(body));
    }
    @PostMapping("/get-by-date-and-shop-id")
    public ResponseEntity getByDateAndShopId(@RequestBody CODByDateAndShopId body) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.getOrderByDateAndShopId(body));
    }

    @GetMapping("/get-by-shop-id/{id}")
    public ResponseEntity getByShopId(@PathVariable Long id) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.orderService.getOrderByShopId(id));
    }

    @GetMapping(value = "/page-by-order", params = {"id"})
    public ResponseEntity getPageByOrderId(@RequestParam int id) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND, Constans.Code.OK.getCode(), HttpStatus.OK, this.orderService.getPageByOrderId(id));
    }

}

