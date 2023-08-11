package com.mock.qlgiaohangback.service;

import com.mock.qlgiaohangback.dto.PagingResp;
import com.mock.qlgiaohangback.dto.carrier.*;
import com.mock.qlgiaohangback.entity.CarrierEntity;

import java.util.List;

public interface ICarrierService {
    CarrierEntity createCarrier(CarrierCreateDTO carrierCreateDTO);
    CarrierEntity save(CarrierEntity carrier);

    CarrierRespDTO getCurrentCarrier();

    CarrierEntity getCarrierById(long id);

    PagingResp<CarrierRespDTO> getAll(int page);

    List<CarrierInfoManager> getAllWithoutPaging();

    int updateCarrierActiveById(long id, boolean active, String geometric);

    CarrierDetailDTO getDetailFollowOrder(long id);


    int updateLocationCarrierByAccountId(long id, double longitude, double latitude);

    List<CarrierToRecommendDTO> recommendCarrierForOrder(double longitude, double latitude);

    CarrierEntity getCarrierByAccountId(long accountId);

    CarrierEntity updateCarrier(CarrierEntity carrier);

    int rejectOrder(long orderId);

    List<CarrierToRecommendDTO> getByShopId(long shopId);

    boolean checkCarrierCanTakeOrder(long carrierId);

    void updateAvailable(long carrierId);
}
