package com.mock.qlgiaohangback.repository.custom;

import com.mock.qlgiaohangback.dto.carrier.CarrierDistanceDTO;

import java.util.List;

public interface CarrierRepoCustom {
    List<CarrierDistanceDTO> getCarrierByLocation(double longitude, double latitude, double radius);
}
