package com.mock.qlgiaohangback.service.impl;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.dto.PagingResp;
import com.mock.qlgiaohangback.dto.carrier.*;
import com.mock.qlgiaohangback.dto.shop.ShopDetailRespDTO;
import com.mock.qlgiaohangback.entity.AccountEntity;
import com.mock.qlgiaohangback.entity.CarrierEntity;
import com.mock.qlgiaohangback.entity.OrderEntity;
import com.mock.qlgiaohangback.exception.ResponseException;
import com.mock.qlgiaohangback.mapper.ICarrierMapper;
import com.mock.qlgiaohangback.repository.CarrierRepository;
import com.mock.qlgiaohangback.repository.OrderRepository;
import com.mock.qlgiaohangback.service.IAccountService;
import com.mock.qlgiaohangback.service.ICarrierService;
import com.mock.qlgiaohangback.service.IShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class CarrierService implements ICarrierService {

    private final CarrierRepository carrierRepository;

    private final OrderRepository orderRepository;

    private final IAccountService accountService;

    private final IShopService shopService;

    private final EntityManager entityManager;

    @Override
    public CarrierEntity createCarrier(CarrierCreateDTO carrierCreateDTO) {
        return this.carrierRepository.save(ICarrierMapper.INSTANCE.createToEntity(carrierCreateDTO));
    }

    @Override
    public CarrierEntity save(CarrierEntity carrier) {
        return this.carrierRepository.save(carrier);
    }

    @Override
    public CarrierRespDTO getCurrentCarrier() {
        AccountEntity account = this.accountService.getCurrentAccount();
        CarrierEntity carrier = this.carrierRepository.findByAccount_Id(account.getId()).orElse(null);
        return ICarrierMapper.INSTANCE.entityToRespDTO(carrier);
    }

    @Override
    public CarrierEntity getCarrierById(long id) {
        return this.carrierRepository.findById(id).orElse(null);
    }

    @Override
    public PagingResp<CarrierRespDTO> getAll(int page) {
        if (page < 1) return null;
        Page<CarrierEntity> carriersGot = this.carrierRepository.findAll(PageRequest.of(page - 1, (Integer) Constans.CommonConstant.SIZE_PAGE.getSomeThing()));
        return PagingResp.<CarrierRespDTO>builder()
                .listData(ICarrierMapper.INSTANCE.listEntityToListRespDTO(carriersGot.getContent()))
                .totalPage(carriersGot.getTotalPages()).build();
    }

    @Override
    public List<CarrierInfoManager> getAllWithoutPaging() {
        List<CarrierEntity> carrierEntities = this.carrierRepository.findAll();
        List<CarrierInfoManager> resp = carrierEntities.stream().map(item -> {
           long orderDelivering = item.getOrders().stream().filter(o -> o.getStatus().equals(Constans.OrderStatus.BEING_TRANSPORTED)).count();
           double orderNotRefundYet = item.getOrders().stream().filter(o -> o.getStatus().equals(Constans.OrderStatus.DELIVERY_SUCCESSFUL) && o.getIsPaid() != null && !o.getIsPaid()).reduce(0.0, (sub, cur) -> sub + cur.getPaymentTotal(), Double::sum);
           return CarrierInfoManager.builder()
                   .id(item.getId())
                   .name(item.getName())
                   .phoneNumber(item.getPhoneNumber())
                   .orderDelivering(orderDelivering)
                   .cashNotRefundYet(orderNotRefundYet)
                   .statusDelivery(item.isActive()).build();
        }).collect(Collectors.toList());
        return resp;
    }

    @Override
    public int updateCarrierActiveById(long id, boolean active, String geometric) {
        AccountEntity account = this.accountService.getAccountById(id);
        CarrierEntity carrierEntity = this.carrierRepository.findByAccount_Id(account.getId()).orElse(null);
        if (carrierEntity == null) {
            throw new ResponseException(MessageResponse.NOT_EXISTED, HttpStatus.BAD_REQUEST, Constans.Code.NOT_EXITED.getCode());
        }

        String[] longLat = geometric.split(",");

        if (longLat.length < 2) throw new ResponseException(MessageResponse.VALUE_PASSED_INCORRECT, HttpStatus.BAD_REQUEST, Constans.Code.INVALID.getCode());

        carrierEntity.setActive(active);
        carrierEntity.setLongitudeNewest(Double.valueOf(longLat[0]));
        carrierEntity.setLatitudeNewest(Double.valueOf(longLat[1]));

        this.carrierRepository.save(carrierEntity);

        return 1;
    }

    @Override
    public CarrierDetailDTO getDetailFollowOrder(long id) {

//      Get out the number of delivering order
        List<Constans.OrderStatus> statusesDelivering = Arrays.asList(
                Constans.OrderStatus.REQUEST_SHIPPING,
                Constans.OrderStatus.PICKING_UP_GOODS,
                Constans.OrderStatus.BEING_TRANSPORTED);

        List<OrderEntity> orderDelivering = this.orderRepository.findByCarrierIdAndStatusIn(id, statusesDelivering);

        //      Get out the number of delivered order
        List<Constans.OrderStatus> statusesDelivered = Arrays.asList(Constans.OrderStatus.DELIVERY_SUCCESSFUL, Constans.OrderStatus.DONE, Constans.OrderStatus.REFUNDS);

        List<OrderEntity> orderDelivered = this.orderRepository.findByCarrierIdAndStatusIn(id, statusesDelivered);

        //      Get out the total cash not return yet

        List<Constans.OrderStatus> cashNotReturn = Arrays.asList(Constans.OrderStatus.DELIVERY_SUCCESSFUL);

        List<OrderEntity> orderNotReturn = this.orderRepository.findByCarrierIdAndStatusIn(id, cashNotReturn);

        double totalCash = orderNotReturn.stream().map(OrderEntity::getPaymentTotal).reduce((double) 0, Double::sum);

        return CarrierDetailDTO.builder().numberOfOrderDelivered(orderDelivered.size()).numberOfOrderDelivering(orderDelivering.size()).totalCashNotPayment(totalCash).build();
    }

    @Override
    public int updateLocationCarrierByAccountId(long id, double longitude, double latitude) {
        CarrierEntity carrierEntity = this.carrierRepository.findByAccount_Id(id).orElse(null);
        if (carrierEntity != null) {
            carrierEntity.setLatitudeNewest(latitude);
            carrierEntity.setLongitudeNewest(longitude);
            this.carrierRepository.save(carrierEntity);
            return 1;
        }
        return 0;
    }

    @Override
    public List<CarrierToRecommendDTO> recommendCarrierForOrder(double longitude, double latitude) {
        List<CarrierDistanceDTO> carriers = this.carrierRepository.getCarrierByLocation(longitude, latitude, 5.0);
        List<CarrierEntity> carrierEntities = carriers.stream().map(item -> {
           CarrierEntity carrier = this.carrierRepository.findById(item.getId()).get();
           carrier.setDistance(item.getDistance());
           return carrier;
        }).filter(CarrierEntity::isAvailable).collect(Collectors.toList());

        if (carrierEntities.size() == 0) {
            return null;
        }

        List<CarrierToRecommendDTO> toRecommendDTOS = carrierEntities.stream().map((item) -> {
            double rating = item.getNumberRejectOrder() != 0 && item.getNumberAcceptOrder() != 0 ? item.getNumberAcceptOrder() / (item.getNumberAcceptOrder() + item.getNumberRejectOrder()) : 0;
            CarrierToRecommendDTO carrier = ICarrierMapper.INSTANCE.toRecommendDTO(item);
            int totalOrderCompleteOnTime = this.totalOrderCompleteOnTime(carrier.getId());
            int totalOrderCompleted = this.totalOrderCompleted(carrier.getId());
            carrier.setOrderAcceptRating(rating);
            carrier.setCountNumberOnTime(totalOrderCompleteOnTime);
            carrier.setNumberOrderCompleted(totalOrderCompleted);
            return  carrier;
        }).collect(Collectors.toList());

        double maxCompleteOnTime =  toRecommendDTOS.stream().mapToDouble(CarrierToRecommendDTO::getCountNumberOnTime).max().orElseThrow(NoSuchElementException::new);
        double minCompleteOnTime = toRecommendDTOS.stream().mapToDouble(CarrierToRecommendDTO::getCountNumberOnTime).min().orElseThrow(NoSuchElementException::new);

        double maxOrderCompleted =  toRecommendDTOS.stream().mapToDouble(CarrierToRecommendDTO::getNumberOrderCompleted).max().orElseThrow(NoSuchElementException::new);
        double minOrderCompleted =  toRecommendDTOS.stream().mapToDouble(CarrierToRecommendDTO::getNumberOrderCompleted).min().orElseThrow(NoSuchElementException::new);

        toRecommendDTOS.forEach((item) -> {
            item.setNumberOrderCompleted(normalizeProperty(minOrderCompleted, maxOrderCompleted, item.getNumberOrderCompleted()));
            item.setCountNumberOnTime(normalizeProperty(minCompleteOnTime, maxCompleteOnTime, item.getCountNumberOnTime()));

            item.setWeightAverage(weightAverageCalculateForShipper(item.getOrderAcceptRating(), item.getCountNumberOnTime(), item.getNumberOrderCompleted()));
        });
        toRecommendDTOS.sort(Comparator.comparingDouble(CarrierToRecommendDTO::getWeightAverage));

        List<CarrierToRecommendDTO> top10 = toRecommendDTOS.subList(Math.max(toRecommendDTOS.size() - 10, 0), toRecommendDTOS.size());
        Collections.reverse(top10);
        return top10;
    }

    @Override
    public CarrierEntity getCarrierByAccountId(long accountId) {
        return this.carrierRepository.findByAccount_Id(accountId).orElse(null);
    }

    @Override
    public CarrierEntity updateCarrier(CarrierEntity carrier) {
        return this.carrierRepository.save(carrier);
    }

    @Override
    public int rejectOrder(long orderId) {
        AccountEntity account = this.accountService.getCurrentAccount();
        CarrierEntity carrier = this.getCarrierByAccountId(account.getId());
        carrier.setNumberRejectOrder(carrier.getNumberRejectOrder() + 1);
        this.updateCarrier(carrier);


        return 1;
    }

    @Override
    public List<CarrierToRecommendDTO> getByShopId(long shopId) {
        ShopDetailRespDTO shop = this.shopService.getShopById(shopId);
        if (shop.getLongitude() == null || shop.getLatitude() == null) throw new ResponseException(MessageResponse.NOT_FOUND,
                HttpStatus.BAD_REQUEST,
                Constans.Code.NOT_EXITED.getCode());
        List<CarrierDistanceDTO> carrierEntities = this.carrierRepository.getCarrierByLocation(shop.getLongitude(), shop.getLatitude(), 10.0);
        return carrierEntities.stream().map(item -> {
            CarrierEntity carrierEntity = this.carrierRepository.findById(item.getId()).get();
            CarrierToRecommendDTO toRecommendDTO = ICarrierMapper.INSTANCE.toRecommendDTO(carrierEntity);
            toRecommendDTO.setDistance(item.getDistance());
            return toRecommendDTO;
        }).collect(Collectors.toList());
    }

    @Override
    public boolean checkCarrierCanTakeOrder(long carrierId) {
        List<OrderEntity> orderEntities = this.orderRepository.findByCarrierIdAndStatusIn(carrierId, Arrays.asList(Constans.OrderStatus.PICKING_UP_GOODS, Constans.OrderStatus.BEING_TRANSPORTED));
        return orderEntities.size() < 3;
    }

    public void updateAvailable(long carrierId) {
        boolean checked = checkCarrierCanTakeOrder(carrierId);
        CarrierEntity carrier = this.carrierRepository.findById(carrierId).get();
        carrier.setAvailable(checked);
        this.carrierRepository.save(carrier);
    }

    public int totalOrderCompleteOnTime(long id) {
        return this.orderRepository.countOrderCompletedAtBeforeTimeReceiveExpected(id);
    }

    public int totalOrderCompleted(long id) {
        return this.orderRepository.countOrderEntitiesByStatusInAndCarrierId(List.of(Constans.OrderStatus.DONE, Constans.OrderStatus.DELIVERY_SUCCESSFUL), id);
    }

    private double normalizeProperty(double min, double max, double value) {
        int newMax = 1;
        int newMin = 0;

        return ((value - min) /(max - min)) * (newMax - newMin) + newMin;
    }

    private double weightAverageCalculateForShipper(double highestPriority, double middlePriority, double lowestPriority) {
        return ((highestPriority * 0.3 + middlePriority * 0.2 + lowestPriority * 0.1) / 0.6);
    }

}
