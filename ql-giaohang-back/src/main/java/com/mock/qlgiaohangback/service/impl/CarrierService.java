package com.mock.qlgiaohangback.service.impl;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.dto.PagingResp;
import com.mock.qlgiaohangback.dto.carrier.CarrierCreateDTO;
import com.mock.qlgiaohangback.dto.carrier.CarrierDetailDTO;
import com.mock.qlgiaohangback.dto.carrier.CarrierRespDTO;
import com.mock.qlgiaohangback.dto.carrier.CarrierToRecommendDTO;
import com.mock.qlgiaohangback.entity.AccountEntity;
import com.mock.qlgiaohangback.entity.CarrierEntity;
import com.mock.qlgiaohangback.entity.OrderEntity;
import com.mock.qlgiaohangback.exception.ResponseException;
import com.mock.qlgiaohangback.helpers.LocationHelpers;
import com.mock.qlgiaohangback.helpers.ObjectHelpers;
import com.mock.qlgiaohangback.mapper.ICarrierMapper;
import com.mock.qlgiaohangback.repository.CarrierRepository;
import com.mock.qlgiaohangback.repository.OrderRepository;
import com.mock.qlgiaohangback.service.IAccountService;
import com.mock.qlgiaohangback.service.ICarrierService;
import com.mock.qlgiaohangback.service.IOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class CarrierService implements ICarrierService {

    private final CarrierRepository carrierRepository;

    private final OrderRepository orderRepository;

    private final IAccountService accountService;

    @Override
    public CarrierEntity createCarrier(CarrierCreateDTO carrierCreateDTO) {
        return this.carrierRepository.save(ICarrierMapper.INSTANCE.createToEntity(carrierCreateDTO));
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
    public int updateCarrierActiveById(long id, boolean active, String geometric) {
        CarrierEntity carrierEntity = this.getCarrierById(id);
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
    public int updateLocationCarrierById(long id, double longitude, double latitude) {
        CarrierEntity carrierEntity = this.carrierRepository.findById(id).orElse(null);
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
        List<CarrierEntity> carrierActiveAndAvailable = this.carrierRepository.findByIsActiveTrueAndAvailableTrue();
        List<CarrierEntity> carrierEntitiesInArea = carrierActiveAndAvailable.stream()
                .filter((item) -> LocationHelpers.calculateDistance(latitude, longitude, item.getLatitudeNewest(), item.getLongitudeNewest()) <= 3000).collect(Collectors.toList());
        List<CarrierToRecommendDTO> toRecommendDTOS = carrierEntitiesInArea.stream().map((item) -> {
            CarrierToRecommendDTO carrier = ICarrierMapper.INSTANCE.toRecommendDTO(item);
            int totalOrderCompleteOnTime = this.totalOrderCompleteOnTime(carrier.getId());
            int totalOrderCompleted = this.totalOrderCompleted(carrier.getId());
            carrier.setOrderAcceptRating((double) (item.getNumberAcceptOrder() / (item.getNumberAcceptOrder() + item.getNumberRejectOrder())));
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
