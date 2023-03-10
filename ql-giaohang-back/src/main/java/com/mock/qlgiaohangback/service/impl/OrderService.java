package com.mock.qlgiaohangback.service.impl;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.dto.cod.CODByDateAndShopId;
import com.mock.qlgiaohangback.dto.order.*;
import com.mock.qlgiaohangback.entity.*;
import com.mock.qlgiaohangback.exception.ResponseException;
import com.mock.qlgiaohangback.helpers.db.ICountOrderInThirtyDays;
import com.mock.qlgiaohangback.mapper.IAddressMapper;
import com.mock.qlgiaohangback.mapper.IOrderMapper;
import com.mock.qlgiaohangback.repository.AccountRepository;
import com.mock.qlgiaohangback.repository.AddressRepository;
import com.mock.qlgiaohangback.repository.OrderProductRepository;
import com.mock.qlgiaohangback.repository.OrderRepository;
import com.mock.qlgiaohangback.service.IAccountService;
import com.mock.qlgiaohangback.service.IOrderService;
import com.mock.qlgiaohangback.service.IProductService;
import com.mock.qlgiaohangback.service.IShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService {
    private final OrderRepository orderRepository;
    private final IAccountService accountService;

    private final IShopService shopService;

    private final IProductService productService;
    private final AddressRepository addressRepository;
    private final AccountRepository accountRepository;

    private final OrderProductRepository orderProductRepository;

    public Long getShipperId() {
        Authentication user = SecurityContextHolder.getContext().getAuthentication();
        String username = user.getName();
        AccountEntity account = this.accountService.getAccountByUsername(username);
         System.out.println("shipperid"+account.getId());
        return account.getId();
    }

    @Override
// Order Service chung
    //    Lấy ra danh sách đơn hàng
    public List<OrderRespDTO> getAll() {
        return this.orderRepository
                .findAll().stream().map(IOrderMapper.INSTANCE::toOrderRespDTO).collect(Collectors.toList());
    }

    //      Lấy ra đơn hàng theo id
    public OrderRespDTO getOrderById(Long id) {
        return IOrderMapper.INSTANCE.toOrderRespDTO(this.orderRepository.findOrderEntityById(id));
    }

    //    Lấy danh sách đơn hàng theo status
    public List<OrderRespDTO> getOrderByStatus(Constans.OrderStatus status) {
        return this.orderRepository.findOrderEntityByStatus(status).stream().map(IOrderMapper.INSTANCE::toOrderRespDTO).collect(Collectors.toList());
    }

    //      Lấy danh sách đơn hàng theo customer_name
    public List<OrderRespDTO> getOrderByCustomerName(String name) {
        List<OrderEntity> listOrderByCustomerName = this.orderRepository.findOrderEntityByCustomer_Name(name);
        if (listOrderByCustomerName.isEmpty()) {
            throw new ResponseException(MessageResponse.CUSTOMER_NOT_EXISTED,
                    HttpStatus.BAD_REQUEST, Constans.Code.CUSTOMER_NOT_EXISTED.getCode());
        }
        return this.orderRepository.findOrderEntityByCustomer_Name(name).stream().map(IOrderMapper.INSTANCE::toOrderRespDTO).collect(Collectors.toList());
    }

    @Override
    public OrderRespWithPagingDTO getOrderNewest(int page) {
        if (page < 1) {
            throw new ResponseException(MessageResponse.VALUE_PASSED_INCORRECT, HttpStatus.BAD_REQUEST, Constans.Code.INVALID.getCode());
        }
        ShopEntity shop = this.shopService.getShopLoggedIn();

        Page<OrderEntity> orders = this.orderRepository.findByShopIdOrderByCreatedAtDesc(shop.getId(), PageRequest.of(page - 1,
                Integer.parseInt(Constans.CommonConstant.SIZE_PAGE.getSomeThing().toString())));

        List<OrderRespDTO> orderRespDTOS = IOrderMapper.INSTANCE.toListOrderRespDTO(orders.getContent());

        return OrderRespWithPagingDTO.builder().orders(orderRespDTOS).totalPage(orders.getTotalPages()).build();
    }


    // Order Service Dành Cho SHIPPER
    //    Lấy ra danh sách đơn hàng
    public List<OrderRespDTO> getAllByShipperId() {
        Long shipper_id = getShipperId();
        return this.orderRepository
                .findOrderEntityByCarrier_IdOrderByIdDesc(shipper_id).stream().map(IOrderMapper.INSTANCE::toOrderRespDTO).collect(Collectors.toList());
    }

    //    Lấy ra đơn hàng theo id
    public OrderRespDTO getOrderByIdAndShipperId(Long id) {
        Long shipper_id = getShipperId();
        return IOrderMapper.INSTANCE.toOrderRespDTO(this.orderRepository.findOrderEntityByIdAndCarrier_Id(id, shipper_id));
    }

    //    Lấy danh sách đơn hàng theo status
    public List<OrderRespDTO> getOrderByStatusAndShipperId(Constans.OrderStatus status) {
        Long shipper_id = getShipperId();
        return this.orderRepository.findOrderEntityByStatusAndCarrier_Id(status, shipper_id).stream().map(IOrderMapper.INSTANCE::toOrderRespDTO).collect(Collectors.toList());
    }

    //     Lấy danh sách đơn hàng theo customer_name
    public List<OrderRespDTO> getOrderByCustomerNameAndShipperId(String name) {
        Long shipper_id = getShipperId();
        List<OrderEntity> listOrderByCustomerName = this.orderRepository.findOrderEntityByCustomer_NameAndCarrier_Id(name, shipper_id);
        if (listOrderByCustomerName.isEmpty()) {
            throw new ResponseException(MessageResponse.CUSTOMER_NOT_EXISTED,
                    HttpStatus.BAD_REQUEST, Constans.Code.CUSTOMER_NOT_EXISTED.getCode());
        }
        return this.orderRepository.findOrderEntityByCustomer_NameAndCarrier_Id(name, shipper_id).stream().map(IOrderMapper.INSTANCE::toOrderRespDTO).collect(Collectors.toList());
    }

    //      Đếm tổng số đơn mỗi loại status
    public List<CountOrderByStatusDTO> countOrderByStatus() {

        List<CountOrderByStatusDTO> countOrderByStatus = new ArrayList<>();

        List<OrderRespDTO> list = getOrderByStatusAndShipperId(Constans.OrderStatus.PICKING_UP_GOODS);
        CountOrderByStatusDTO waiting = new CountOrderByStatusDTO();
        waiting.setStatus(Constans.OrderStatus.PICKING_UP_GOODS);
        waiting.setNumber(list.size());
        countOrderByStatus.add(waiting);

        List<OrderRespDTO> list2 = getOrderByStatusAndShipperId(Constans.OrderStatus.BEING_TRANSPORTED);
        CountOrderByStatusDTO delivery = new CountOrderByStatusDTO();
        delivery.setStatus(Constans.OrderStatus.BEING_TRANSPORTED);
        delivery.setNumber(list2.size());
        countOrderByStatus.add(delivery);

        List<OrderRespDTO> list3 = getOrderByStatusAndShipperId(Constans.OrderStatus.DELIVERY_SUCCESSFUL);
        CountOrderByStatusDTO delivered = new CountOrderByStatusDTO();
        delivered.setStatus(Constans.OrderStatus.DELIVERY_SUCCESSFUL);
        delivered.setNumber(list3.size());
        countOrderByStatus.add(delivered);

        List<OrderRespDTO> list4 = getOrderByStatusAndShipperId(Constans.OrderStatus.REFUNDS);
        CountOrderByStatusDTO refund = new CountOrderByStatusDTO();
        refund.setStatus(Constans.OrderStatus.REFUNDS);
        refund.setNumber(list4.size());
        countOrderByStatus.add(refund);

        List<OrderRespDTO> list5 = getOrderByStatusAndShipperId(Constans.OrderStatus.DONE);
        CountOrderByStatusDTO done = new CountOrderByStatusDTO();
        done.setStatus(Constans.OrderStatus.DONE);
        done.setNumber(list5.size());
        countOrderByStatus.add(done);

//        System.out.println(countOrderByStatus);
        return countOrderByStatus;
    }

    //      Đếm số đơn hoàn thành theo ngày
    public Integer countOrderDoneByDate(String date, String nextDate) {
        Long shipper_id = getShipperId();
        return this.orderRepository.countOrderDoneByDate(date, nextDate, shipper_id);
    }

    //      Số tiền COD theo từng status
    public Integer statisticCODByStatus(String status) {
        Long shipper_id = getShipperId();
        return this.orderRepository.statisticCODByStatus(status, shipper_id);
    }

    //      Số tiền Ship theo từng status
    public Integer statisticShipFeeByStatus(String status) {
        Long shipper_id = getShipperId();
        return this.orderRepository.statisticShipFeeByStatus(status, shipper_id);
    }

    //      Doanh thu hôm nay
    public Integer getRevenueToday() {
        Long shipper_id = getShipperId();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-d");
        LocalDateTime now = LocalDateTime.now();
        return this.orderRepository.getRevenueToday(dtf.format(now).toString(), shipper_id);
    }

    //      Doanh thu theo ngày
    public Integer getRevenueByDate(String date, String nextDate) {
        Long shipper_id = getShipperId();
        Integer revenue = this.orderRepository.getRevenueByDate(date, nextDate, shipper_id);
        return this.orderRepository.getRevenueByDate(date, nextDate, shipper_id);
    }

    //      Thay đổi status đơn hàng
    public Integer changeStatus(String id, String status) {
        System.out.println("id, status" + id + " " + status);
        Long shipper_id = getShipperId();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-d HH:mm:ss");
        LocalDateTime completed_at = LocalDateTime.now();
        if (status.matches("DELIVERY_SUCCESSFUL") || status.matches("REFUNDS")) {
            return this.orderRepository.changeStatusToSucessOrRefund(id, shipper_id, status, completed_at.toString());
        }
        return this.orderRepository.changeStatus(id, status, shipper_id);
    }

    @Override
    public Boolean createOrder(OrderCreateDTO orderCreateDTO) {
        OrderEntity orderEntity = IOrderMapper.INSTANCE.toEntity(orderCreateDTO);
//        System.out.println();
//        orderEntity.getOrderProductEntities().forEach((item) -> {
//            System.out.println(item.getOrderProductId());
//        });
        ShopEntity shop = this.shopService.getShopLoggedIn();
        orderEntity.setShop(shop);
        orderEntity.setStatus(Constans.OrderStatus.WAITING_FOR_ACCEPT_NEW_ORDER);
        List<OrderProductEntity> orderProductEntities = orderEntity.getOrderProductEntities().stream().map((item -> {
            item.setOrder(orderEntity);
            ProductEntity product = this.productService.getProductById(item.getOrderProductId().getProductId());
            item.setProduct(product);
            return item;
        })).collect(Collectors.toList());
        orderEntity.setOrderProductEntities(orderProductEntities);
//        System.out.println(orderEntity);
        this.orderRepository.save(orderEntity);

        return true;
    }

    @Override
    public OrderRespWithPagingDTO getOrderWithPaging(int page) {
        ShopEntity shopLogged = this.shopService.getShopLoggedIn();
        Page<OrderEntity> ordersPaging = this.orderRepository.findAllByShopIdOrderByCreatedAtDesc(shopLogged.getId(), PageRequest.of(page - 1,
                Integer.parseInt(Constans.CommonConstant.SIZE_PAGE.getSomeThing().toString())));
        return OrderRespWithPagingDTO.builder().totalPage(ordersPaging.getTotalPages()).orders(IOrderMapper.INSTANCE.toListOrderRespDTO(ordersPaging.getContent())).build();
    }
    //Lấy số lượng đơn hàng theo trạng thái

    @Override
    public Map<Constans.OrderStatus, Long> countByStatus() {
        //Tạo list lưu danh danh sách các trạng thái
        List<Constans.OrderStatus> list = new ArrayList<>();
        list.add(Constans.OrderStatus.WAITING_FOR_ACCEPT_NEW_ORDER);
        list.add(Constans.OrderStatus.REQUEST_SHIPPING);
        list.add(Constans.OrderStatus.PICKING_UP_GOODS);
        list.add(Constans.OrderStatus.BEING_TRANSPORTED);
        list.add(Constans.OrderStatus.DELIVERY_SUCCESSFUL);
        list.add(Constans.OrderStatus.REFUNDS);
        list.add(Constans.OrderStatus.DONE);
        //Tạo Map dạng key: trạng thái  và value: số lượng đơn
        Map<Constans.OrderStatus, Long> result = new HashMap<>();
        //Tạo vòng lặp với mọi trạng thái kiểu OrderStatus truyền tên trạng thái vào câu truy vấn
        for (Constans.OrderStatus c : list) {
            result.put(c, orderRepository.countByStatus(c.toString()));
        }
        return result;
    }


    // Lấy tổng đơn hàng theo mọi trạng thái
    @Override
    public OrderRespoDPhoiWithPagingDTO findAllOrder(String pageIndex, String pageSize) throws Exception {
        Integer pageIndexInt = -1, pageSizeInt = -1;
        try {
            pageIndexInt = Integer.parseInt(pageIndex);
            if (pageSize != null && pageSize.length() > 0) {
                pageSizeInt = Integer.parseInt(pageSize);
            } else {
                pageSizeInt = 10;
            }
        } catch (NumberFormatException e) {
            throw new Exception(e.getMessage());
        }
        Page<OrderEntity> ordersPaging = this.orderRepository.findAll(PageRequest.of(pageIndexInt - 1, pageSizeInt));
        List<OrderEntity> orderEntities = ordersPaging.getContent();
        //convert to dto
        List<OrderRespodieuphoiGeneralDTO> orders = new ArrayList<>();
        for (OrderEntity o : orderEntities) {
            OrderRespodieuphoiGeneralDTO dto = new OrderRespodieuphoiGeneralDTO();
            dto.setMaVanDon(o.getId().toString());
            dto.setCreatedAt(o.getCreatedAt());
            dto.setReceiverName(o.getCustomer().getName());
            dto.setReceiverPhone(o.getCustomer().getPhoneNumber());
            if (o.getCarrier() != null) {
                dto.setCarrierName(o.getCarrier().getName());
                dto.setCarrierPhone(o.getCarrier().getPhoneNumber());
            } else {
                dto.setCarrierName("");
                dto.setCarrierPhone("");
            }
            dto.setStatus(o.getStatus());
            orders.add(dto);
        }
        OrderRespoDPhoiWithPagingDTO output = new OrderRespoDPhoiWithPagingDTO();
        output.setOrders(orders);
        output.setTotalRecord(this.orderRepository.countAllOrder());
        return output;

    }

    //Lấy dsanh đơn hàng theo trạng thái
    @Override
    public OrderRespoDPhoiWithPagingDTO findAllOrderStatus(String pageIndex, String pageSize, Constans.OrderStatus status) throws Exception {
        Integer pageIndexInt = -1, pageSizeInt = -1;
        try {
            pageIndexInt = Integer.parseInt(pageIndex);
            if (pageSize != null && pageSize.length() > 0) {
                pageSizeInt = Integer.parseInt(pageSize);
            } else {
                pageSizeInt = 10;
            }
        } catch (NumberFormatException e) {
            throw new Exception(e.getMessage());
        }
        Page<OrderEntity> ordersPaging = this.orderRepository.findAllByStatus(status, PageRequest.of(pageIndexInt - 1, pageSizeInt));
        List<OrderEntity> orderEntities = ordersPaging.getContent();
        //convert to dto
        List<OrderRespodieuphoiGeneralDTO> orders = new ArrayList<>();
        for (OrderEntity o : orderEntities) {
            OrderRespodieuphoiGeneralDTO dto = new OrderRespodieuphoiGeneralDTO();
            dto.setMaVanDon(o.getId().toString());
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("DD/MM/YYYY HH-MM");
            dto.setCreatedAt(o.getCreatedAt());
            dto.setReceiverName(o.getCustomer().getName());
            dto.setReceiverPhone(o.getCustomer().getPhoneNumber());
            if (o.getCarrier() != null) {
                dto.setCarrierName(o.getCarrier().getName());
                dto.setCarrierPhone(o.getCarrier().getPhoneNumber());
            } else {
                dto.setCarrierName("");
                dto.setCarrierPhone("");
            }
            dto.setStatus(o.getStatus());
            orders.add(dto);

        }
        OrderRespoDPhoiWithPagingDTO output = new OrderRespoDPhoiWithPagingDTO();
        output.setOrders(orders);
        output.setTotalRecord(this.orderRepository.countByStatus(status.toString()));
        return output;

    }

    //Trả về thông tin gửi nhận vận chuyển của đơn hàng theo Id
    @Override
    public OrderRespInfDetailDTO findOrderRespInfDetailById(Long orderId) {
        OrderEntity orderInf = this.orderRepository.findOrderRespInfDetailById(orderId);
        OrderRespInfDetailDTO output = new OrderRespInfDetailDTO();
        output.setShopName(orderInf.getShop().getAccount().getName());
        output.setShopPhone(orderInf.getShop().getAccount().getPhoneNumber());
        output.setShopAdd(IAddressMapper.INSTANCE.toDTO(orderInf.getShop().getAddresses().get(0)));
        output.setReceiverName(orderInf.getCustomer().getName());
        output.setReceiverPhone(orderInf.getCustomer().getPhoneNumber());
        output.setReceiverAdd(IAddressMapper.INSTANCE.toDTO(orderInf.getAddress()));
        if (orderInf.getCarrier() != null) {
            output.setDeliveryName(orderInf.getCarrier().getName());
            output.setDeliveryId(orderInf.getCarrier().getId().toString());
            output.setDeliveryPhone(orderInf.getCarrier().getPhoneNumber());
        } else {
            output.setDeliveryName("");
            output.setDeliveryId("");
            output.setDeliveryPhone("");
        }
        output.setNote(orderInf.getNote());
        output.setCreatedAt(orderInf.getCreatedAt());
        output.setStatus(orderInf.getStatus().toString());

        return output;
    }

    //Gán nhân viên vận chuyển đơn hàng
    @Override
    public Integer assignCarrier(Long orderId, String carrierId) throws Exception {
        //Check input
        if (orderId == null || !StringUtils.hasText(carrierId)) {
            throw new Exception("INPUT INVALID - orderId=" + orderId + "&carrierId=" + carrierId);
        }
        //Check loi convert tu String sang Int/Long
        Long carrierIdLong = -1L;
        try {
            carrierIdLong = Long.parseLong(carrierId);
        } catch (NumberFormatException e) {
//            System.out.println("-------NumberFormatException assignCarrier------");
            throw new Exception(e.getMessage());
        }
        //Check orderId ton tai
        OrderEntity orderEntity = orderRepository.findOrderEntityById(orderId);
        if (orderEntity == null) {
            throw new Exception("Order Id is not existed!");
        }
        //Check carrierId ton tai
        AccountEntity accountEntity = accountRepository.findAccById(carrierIdLong);
        if (accountEntity == null) {
            throw new Exception("Carrier Id is not existed!");
        }
        int id = orderRepository.updateCarrierIdAndStatus(String.valueOf(Constans.OrderStatus.PICKING_UP_GOODS), carrierIdLong, orderId, new Date());
        return id;
    }

    @Override
    public OrderRespProductDetailInfDTO findAllProductOrderById(Long orderId) throws Exception {
        OrderRespProductDetailInfDTO result = new OrderRespProductDetailInfDTO();
        List<OrderProductEntity> listProduct = this.orderProductRepository.findByOrderId(orderId);
        List<OrderRespProductDetailDTO> listProductConvert = new ArrayList<>();
        for (OrderProductEntity p : listProduct) {
            result.setType(p.getOrder().getType());
            result.setDeliveryFee(p.getOrder().getShipFee());
            OrderRespProductDetailDTO product = new OrderRespProductDetailDTO();
            product.setName(p.getProduct().getName());
            product.setProductPrice(p.getProductPrice());
            product.setProductQuantity(p.getProductQuantity());
            product.setWeight(p.getProduct().getWeight());
            product.setPathImage(p.getProduct().getPathImage());
            listProductConvert.add(product);
        }
        result.setProducts(listProductConvert);
        return result;
    }


    @Override
    public Integer cancelOrder(Long orderId) {
        OrderEntity orderEntity = this.orderRepository.findOrderEntityById(orderId);
        orderEntity.setStatus(Constans.OrderStatus.CANCEL);
        this.orderRepository.save(orderEntity);
        return 1;
    }

    @Override
    public List<OrderRespDTO> getOrderByDateAndCarrierId(OrderByDateAndCarrierId order) {
        long carrierId = order.getCarrierId();
        Date orderCreatedAt = order.getCreatedAt();
        List<OrderRespDTO> listOrder = orderRepository
                .findOrderEntityByCarrier_IdOrderByIdDesc(carrierId).stream().map(IOrderMapper.INSTANCE::toOrderRespDTO).collect(Collectors.toList());

        List<OrderRespDTO> returnOrders = listOrder.stream().filter(o -> {
            LocalDate localDate1 = orderCreatedAt.toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate();
            LocalDate localDate2 = o.getCreatedAt().toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate();
            return localDate1.isEqual(localDate2);
        }).collect(Collectors.toList());
        return returnOrders;
    }

    @Override
    public List<OrderRespDTO> getOrderByDateAndShopId(CODByDateAndShopId cod) {
        long shopId = cod.getShopId();
        String date = cod.getDate();
        List<OrderRespDTO> listOrder = orderRepository
                .findOrderEntytyByShopId(shopId).stream().map(IOrderMapper.INSTANCE::toOrderRespDTO).collect(Collectors.toList());
        List<OrderRespDTO> returnOrders = listOrder.stream().filter(o -> {
            Calendar calendar = Calendar.getInstance();
            if (o.getCompletedAt() == null) return false;
            calendar.setTime(o.getCompletedAt());
            int year = calendar.get(Calendar.YEAR);
            int month = calendar.get(Calendar.MONTH) + 1;
            int day = calendar.get(Calendar.DAY_OF_MONTH);
            String oDate = String.valueOf(day) + "/" + String.valueOf(month) + "/" + String.valueOf(year);
            return date.equals(oDate);
        }).collect(Collectors.toList());
        return returnOrders;
    }

    @Override
    public List<OrderRespDTO> getOrderByShopId(Long id) {
        List<OrderRespDTO> listOrder = orderRepository
                .findOrderEntytyByShopId(id).stream().map(IOrderMapper.INSTANCE::toOrderRespDTO).collect(Collectors.toList());
        return listOrder;
    }

    @Override
    public List<OrderEntity> updateOrderIsPaid(OrderByDateAndListId order) {
        System.out.println("Hihi");
        List<Long> listId = order.getListId();
        Date orderCreatedAt = order.getCreatedAt();
        Long carrierId = order.getCarrierId();

        List<OrderEntity> listOrder = orderRepository.findOrderEntityByCarrier_IdOrderByIdDesc(carrierId);
        listOrder = listOrder.stream().filter(o -> {
            LocalDate localDate1 = orderCreatedAt.toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate();
            LocalDate localDate2 = o.getCreatedAt().toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate();
            return localDate1.isEqual(localDate2);
        }).collect(Collectors.toList());

        listOrder.forEach(item -> {
            if (listId.contains(item.getId())) {
                item.setIsPaid(true);
            }
        });
        listOrder = orderRepository.saveAll(listOrder);
        return listOrder;
    }

    public List<CountOrderByRangeDateDTO> getOrderInThirtyDays(String startDate, String endDate) {
        ShopEntity shop = this.shopService.getShopLoggedIn();
        List<ICountOrderInThirtyDays> order = this.orderRepository.countOrderInThirtyDays(startDate, endDate, shop.getId());

        return order.stream().map(item -> CountOrderByRangeDateDTO.builder().status(item.getStatus()).countOrder(item.getCountOrder()).dateCreate(item.getDateCreate()).build()
        ).collect(Collectors.toList());
    }

    @Override
    public List<OrderRespDTO> getOrderNotDoneYet() {
        ShopEntity shop = this.shopService.getShopLoggedIn();
        return IOrderMapper.INSTANCE.toListOrderRespDTO(this.orderRepository.getAllNotDoneYet(shop.getId()));
    }


}
