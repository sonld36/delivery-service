package com.mock.qlgiaohangback.service;

import com.mock.qlgiaohangback.dto.PagingResp;
import com.mock.qlgiaohangback.dto.carrier.CarrierCreateDTO;
import com.mock.qlgiaohangback.dto.carrier.CarrierDetailDTO;
import com.mock.qlgiaohangback.dto.carrier.CarrierRespDTO;
import com.mock.qlgiaohangback.dto.carrier.CarrierToRecommendDTO;
import com.mock.qlgiaohangback.entity.CarrierEntity;

import java.util.List;

public interface ICarrierService {
    CarrierEntity createCarrier(CarrierCreateDTO carrierCreateDTO);

    CarrierRespDTO getCurrentCarrier();

    CarrierEntity getCarrierById(long id);

    PagingResp<CarrierRespDTO> getAll(int page);

    int updateCarrierActiveById(long id, boolean active, String geometric);

    CarrierDetailDTO getDetailFollowOrder(long id);


    int updateLocationCarrierById(long id, double longitude, double latitude);

    List<CarrierToRecommendDTO> recommendCarrierForOrder(double longitude, double latitude);

    CarrierEntity getCarrierByAccountId(long accountId);

    CarrierEntity updateCarrier(CarrierEntity carrier);

    int rejectOrder(long orderId);
}
