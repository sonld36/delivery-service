package com.mock.qlgiaohangback.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.common.ResponseHandler;
import com.mock.qlgiaohangback.dto.carrier.CarrierToRecommendDTO;
import com.mock.qlgiaohangback.dto.cod.CODByDateAndShopId;
import com.mock.qlgiaohangback.dto.order.*;
import com.mock.qlgiaohangback.dto.user.AccountRespDTO;
import com.mock.qlgiaohangback.entity.*;
import com.mock.qlgiaohangback.exception.ResponseException;
import com.mock.qlgiaohangback.helpers.StringHelper;
import com.mock.qlgiaohangback.helpers.db.ICountOrderInThirtyDays;
import com.mock.qlgiaohangback.mapper.IAccountMapper;
import com.mock.qlgiaohangback.mapper.IAddressMapper;
import com.mock.qlgiaohangback.mapper.ICarrierMapper;
import com.mock.qlgiaohangback.mapper.IOrderMapper;
import com.mock.qlgiaohangback.repository.*;
import com.mock.qlgiaohangback.service.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.MessageHandler;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService implements IOrderService {
    private final OrderRepository orderRepository;
    private final IAccountService accountService;

    private final IShopService shopService;

    private final IProductService productService;

    private final OrderProductRepository orderProductRepository;

    private final SimpMessagingTemplate simpMessagingTemplate;

    private final IOrderLogService orderLogService;

    private final INotificationService notificationService;

    private final ICarrierService carrierService;

    private final CarrierRepository carrierRepository;

    public Long getShipperId() {
        Authentication user = SecurityContextHolder.getContext().getAuthentication();
        String username = user.getName();
        AccountEntity account = this.accountService.getAccountByUsername(username);
        CarrierEntity carrier = this.carrierService.getCarrierByAccountId(account.getId());
        return carrier.getId();
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
        OrderEntity orderEntity = this.orderRepository.findOrderEntityById(id);
        OrderRespDTO order = IOrderMapper.INSTANCE.toOrderRespDTO(orderEntity);
        if (Arrays.asList(Constans.OrderStatus.PICKING_UP_GOODS, Constans.OrderStatus.BEING_TRANSPORTED, Constans.OrderStatus.CANCEL).contains(order.getStatus())) {
            CarrierEntity carrierEntity = orderEntity.getCarrier();
            order.setCurrentLat(carrierEntity.getLatitudeNewest());
            order.setCurrentLong(carrierEntity.getLongitudeNewest());
        }

        return order;
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

    @Override
    public List<OrderRespDTO> getAllByShipperId(Long shipperId) {
        return this.orderRepository
                .findOrderEntityByCarrier_IdOrderByIdDesc(shipperId).stream().map(IOrderMapper.INSTANCE::toOrderRespDTO).collect(Collectors.toList());

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

    @Override
    public List<OrderRespDTO> getOrderByStatusAndShipperId(Constans.OrderStatus status, Long shipperId) {
        return this.orderRepository.findOrderEntityByStatusAndCarrier_Id(status, shipperId).stream().map(IOrderMapper.INSTANCE::toOrderRespDTO).collect(Collectors.toList());
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
    public Integer changeStatus(String id, Constans.OrderStatus status) throws JsonProcessingException {

        OrderEntity oldOrder = this.orderRepository.findOrderEntityById(Long.parseLong(id));
        oldOrder.setStatus(status);
        if (status.equals(Constans.OrderStatus.DELIVERY_SUCCESSFUL) || status.equals(Constans.OrderStatus.REFUNDS)) {
            oldOrder.setCompletedAt(new Date());
        }
        OrderEntity order = this.orderRepository.save(oldOrder);
        this.orderLogService.save(IOrderMapper.INSTANCE.toOrderRespDTO(order), Constans.OrderLogAction.ORDER_LOG_ACTION_UPDATED);
        this.carrierService.updateAvailable(oldOrder.getCarrier().getId());

        return 1;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean createOrder(OrderCreateDTO orderCreateDTO) throws JsonProcessingException {
        OrderEntity orderEntity = IOrderMapper.INSTANCE.toEntity(orderCreateDTO);
        ShopEntity shop = this.shopService.getShopLoggedIn();
        orderEntity.setShop(shop);
        orderEntity.setStatus(Constans.OrderStatus.REQUEST_SHIPPING);
        List<OrderProductEntity> orderProductEntities = orderEntity.getOrderProductEntities().stream().map((item -> {
            item.setOrder(orderEntity);
            ProductEntity product = this.productService.getProductById(item.getOrderProductId().getProductId());
            item.setProduct(product);
            return item;
        })).collect(Collectors.toList());
        List<CarrierToRecommendDTO> carrierEntities = this.carrierService.recommendCarrierForOrder(shop.getLongitude(), shop.getLatitude());
        orderEntity.setOrderProductEntities(orderProductEntities);
        OrderEntity orderCreated = this.orderRepository.save(orderEntity);
        OrderRespDTO orderRespDTO = IOrderMapper.INSTANCE.toOrderRespDTO(orderCreated);
        String topicNotify = "/" +
                StringUtils.lowerCase(Constans.SocketTopic.NOTIFY.name()) +
                "/3";

        if (carrierEntities != null) {
            carrierEntities.forEach((item) -> {
                String topic = StringHelper.getSocketTopic(Constans.SocketTopic.REQUEST_SHIPPING).concat("/" + item.getAccountId());
                try {
                    this.notificationService.createNotify(topic,
                            ResponseHandler.generateResponseSocket(MessageResponse.JUST_ASSIGN_CARRIER, orderRespDTO.getId()), this.accountService.getAccountById(item.getAccountId()), shop.getAccount(), Constans.SocketTopic.REQUEST_SHIPPING
                    );
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
            });
        }
        String message = MessageResponse.JUST_CREATED_ORDER + shop.getAccount().getName();
        AccountEntity destination = this.accountService.getAccountsByRole(Constans.Roles.ROLE_COORDINATOR, 1).getContent().get(0);
        this.orderLogService.save(orderRespDTO, Constans.OrderLogAction.ORDER_LOG_ACTION_CREATED);

        /*
        * Gửi tin đến topic thông báo
        * */
        this.notificationService.createNotify(topicNotify,
                ResponseHandler.generateResponseSocket(message, null),
                destination, null, Constans.SocketTopic.NOTIFY);
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
    public OrderRespoDPhoiWithPagingDTO findAllOrder(int pageIndex) throws Exception {
        if (pageIndex < 1) {
            throw new ResponseException(MessageResponse.VALUE_PASSED_INCORRECT, HttpStatus.BAD_REQUEST, Constans.Code.INVALID.getCode());
        }
        Page<OrderEntity> ordersPaging = this.orderRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(pageIndex - 1, Integer.parseInt(Constans.CommonConstant.SIZE_PAGE.getSomeThing().toString())));
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
    public OrderRespoDPhoiWithPagingDTO findAllOrderStatus(int pageIndex, Constans.OrderStatus status) throws Exception {
        if (pageIndex < 1) {
            throw new ResponseException(MessageResponse.VALUE_PASSED_INCORRECT, HttpStatus.BAD_REQUEST, Constans.Code.INVALID.getCode());
        }
        Page<OrderEntity> ordersPaging = this.orderRepository.findAllByStatusOrderByCreatedAtDesc(status, PageRequest.of(pageIndex - 1, Integer.parseInt(Constans.CommonConstant.SIZE_PAGE.getSomeThing().toString())));
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
            dto.setDestinationAddress(o.getDestinationAddress());
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
        output.setShopId(orderInf.getShop().getId());
        output.setShopName(orderInf.getShop().getAccount().getName());
        output.setShopPhone(orderInf.getShop().getAccount().getPhoneNumber());
        output.setShopAdd(IAddressMapper.INSTANCE.toDTO(orderInf.getShop().getAddresses().get(0)));
        output.setReceiverName(orderInf.getCustomer().getName());
        output.setReceiverPhone(orderInf.getCustomer().getPhoneNumber());
        output.setReceiverAdd(orderInf.getDestinationAddress());
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
    @Transactional(rollbackFor = Exception.class)
    @Override
    public Integer assignCarrier(Long orderId, Long carrierId) throws Exception {
        //Check input
        if (orderId == null || carrierId == null) {
            throw new Exception("INPUT INVALID - orderId=" + orderId + "&carrierId=" + carrierId);
        }
        //Check loi convert tu String sang Int/Long

        //Check orderId ton tai
        OrderEntity orderEntity = orderRepository.findOrderEntityById(orderId);
        if (orderEntity == null) {
            throw new Exception("Order Id is not existed!");
        }
        //Check carrierId ton tai
        CarrierEntity  carrier = this.carrierService.getCarrierById(carrierId);
        if (carrier == null) {
            throw new Exception("Carrier Id is not existed!");
        }
        orderEntity.setStatus(Constans.OrderStatus.REQUEST_SHIPPING);
        orderEntity.setCarrier(carrier);
        this.orderRepository.save(orderEntity);
//        String topicNotify = "/" +
//                StringUtils.lowerCase(Constans.SocketTopic.NOTIFY.name()) +
//                "/3";
        String topic = "/" +
                StringUtils.lowerCase(Constans.SocketTopic.NOTIFY.name()) + "/order-request/" + carrier.getAccount().getId();
        String message = MessageResponse.JUST_ASSIGN_CARRIER + "#" + orderId;
        this.notificationService.createNotify(topic,
                ResponseHandler.generateResponseSocket(message, IOrderMapper.INSTANCE.toOrderRespDTO(orderEntity)),
                this.accountService.getAccountById(carrier.getAccount().getId()), null, Constans.SocketTopic.NOTIFY);

//        int id = orderRepository.updateCarrierIdAndStatus(String.valueOf(Constans.OrderStatus.PICKING_UP_GOODS), carrierId, orderId, new Date());

        return 1;
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
    public Integer countByCarrierAndStatus(AccountEntity account, Constans.OrderStatus status) {
        return this.orderRepository.countByCarrierAndStatus(account, status);
    }

    @Override
    public Integer getPageByOrderId(long orderId) {
        int index = this.orderRepository.getIndexOfEntity(orderId) + 1;
        long totalRecord = this.orderRepository.countAllOrder();
        return (Integer.parseInt(String.valueOf((totalRecord - index)))/ Integer.parseInt(Constans.CommonConstant.SIZE_PAGE.getSomeThing().toString())) + 1;
    }

    @Override
    public List<OrderEntity> getByCarrierIdAndListStatus(long carrierId, List<Constans.OrderStatus> statuses) {
        return this.orderRepository.findByCarrierIdAndStatusIn(carrierId, statuses);
    }

    @Override
    @Transactional
    public int takeOrder(long orderId) throws JsonProcessingException {
        AccountEntity account = this.accountService.getCurrentAccount();
        CarrierEntity carrier = this.carrierService.getCarrierByAccountId(account.getId());
//        if (!this.carrierService.checkCarrierCanTakeOrder(carrier.getId())) {
//            carrier.setAvailable(false);
//            this.carrierRepository.save(carrier);
//        }
        OrderEntity orderEntity = this.orderRepository.findOrderEntityById(orderId);
        if (orderEntity.getCarrier() != null) {
            throw new ResponseException(MessageResponse.EXISTED, HttpStatus.BAD_REQUEST, Constans.Code.ORDER_WAS_ASSIGNED.getCode());
        }


        if (carrier == null) {
            throw new ResponseException(MessageResponse.NOT_EXISTED, HttpStatus.BAD_REQUEST, Constans.Code.USER_NOT_EXISTED.getCode());
        }

        carrier.setNumberAcceptOrder(carrier.getNumberAcceptOrder() + 1);
        CarrierEntity carrierUpdated = this.carrierService.updateCarrier(carrier);

        orderEntity.setCarrier(carrierUpdated);

        orderEntity.setStatus(Constans.OrderStatus.PICKING_UP_GOODS);
        OrderEntity order = this.orderRepository.save(orderEntity);
        this.orderLogService.save(IOrderMapper.INSTANCE.toOrderRespDTO(order), Constans.OrderLogAction.ORDER_LOG_ACTION_UPDATED);
        this.carrierService.updateAvailable(carrier.getId());

        return 1;
    }

    @Override
    public List<CountOrderByRangeDateDTO> getInAWeekByCarrier() {
        AccountEntity account = this.accountService.getCurrentAccount();
        CarrierEntity carrier = this.carrierService.getCarrierByAccountId(account.getId());
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");

        Date date = new Date();
        String toDate = dateFormat.format(date);

        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DATE, -7);
        Date toDate1 = cal.getTime();
        String fromDate = dateFormat.format(toDate1);

        List<ICountOrderInThirtyDays> countOrderByRangeDateDTOS = this.orderRepository.countOrderInAWeek(fromDate, toDate, carrier.getId());
        return countOrderByRangeDateDTOS.stream()
                .map((item) ->
                        CountOrderByRangeDateDTO.builder()
                                .countOrder(item.getCountOrder()).dateCreate(item.getDateCreate()).status(item.getStatus())
                                .build())
                .collect(Collectors.toList());
    }


    @Override
    public Integer cancelOrder(Long orderId) throws JsonProcessingException {
        ShopEntity shop = this.shopService.getShopLoggedIn();
        OrderEntity orderEntity = this.orderRepository.findOrderEntityById(orderId);
        List<Constans.OrderStatus> statuses = Arrays.asList(Constans.OrderStatus.DONE,
                Constans.OrderStatus.DELIVERY_SUCCESSFUL,
                Constans.OrderStatus.RETURN,
                Constans.OrderStatus.REFUNDS,
                Constans.OrderStatus.CANCEL);
        if (statuses.contains(orderEntity.getStatus())) {
            throw new ResponseException(MessageResponse.ORDER_NOT_CANCEL, HttpStatus.BAD_REQUEST, Constans.Code.ORDER_NOT_CANCEL.getCode());
        }
        orderEntity.setStatus(Constans.OrderStatus.CANCEL);
        this.orderRepository.save(orderEntity);
        if (orderEntity.getCarrier() != null) {
            CarrierEntity carrier = orderEntity.getCarrier();
            String topic = "/" +
                    StringUtils.lowerCase(Constans.SocketTopic.NOTIFY.name()) + "/order-cancel/" + carrier.getAccount().getId();
            String message = MessageResponse.CANCEL_ORDER + ", mã đơn #" + orderId;
            this.notificationService.createNotify(topic,
                    ResponseHandler.generateResponseSocket(message, orderEntity.getId()),
                    this.accountService.getAccountById(carrier.getAccount().getId()), shop.getAccount(), Constans.SocketTopic.NOTIFY);
        }
        return 1;
    }

    @Override
    public List<OrderRespDTO> getOrderByDateAndCarrierId(String date, Long id) throws ParseException {
        Date date1 = new SimpleDateFormat("M/d/yyyy").parse(date);
        List<OrderEntity> orders = this.orderRepository.findByCompleteAtAndCarrierId(date1, id);
        return IOrderMapper.INSTANCE.toListOrderRespDTO(orders);
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
        List<Long> listId = order.getListId();
        Long carrierId = order.getCarrierId();

        List<OrderEntity> listOrder = orderRepository.findByCarrierIdAndIdIsIn(carrierId, listId);

        List<OrderEntity> toUpdate = listOrder.stream().map(item -> {
            item.setIsPaid(true);
            return item;
        }).collect(Collectors.toList());
        listOrder = orderRepository.saveAll(toUpdate);
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
