package com.mock.qlgiaohangback.repository.custom.impl;

import com.mock.qlgiaohangback.dto.carrier.CarrierDistanceDTO;
import com.mock.qlgiaohangback.repository.custom.CarrierRepoCustom;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.ParameterMode;
import javax.persistence.StoredProcedureQuery;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class CarrierRepoCustomImpl implements CarrierRepoCustom {

    private final EntityManager em;
    @Transactional
    @Override
    public List<CarrierDistanceDTO> getCarrierByLocation(double longitude, double latitude, double radius) {
        StoredProcedureQuery storedProcedureQuery = em.createStoredProcedureQuery("GetAllCarrierByLocation");
        storedProcedureQuery.registerStoredProcedureParameter("longitude", Double.class, ParameterMode.IN);
        storedProcedureQuery.registerStoredProcedureParameter("latitude", Double.class, ParameterMode.IN);
        storedProcedureQuery.registerStoredProcedureParameter("radius", Double.class, ParameterMode.IN);
        storedProcedureQuery.setParameter("longitude", longitude);
        storedProcedureQuery.setParameter("latitude", latitude);
        storedProcedureQuery.setParameter("radius", radius);
        storedProcedureQuery.execute();
        List<Objects[]> res = storedProcedureQuery.getResultList();
        List<CarrierDistanceDTO> carrierDistanceDTOS = new ArrayList<>();
        for (Object[] item: res) {
            CarrierDistanceDTO carrierDistanceDTO = CarrierDistanceDTO.builder().id(Long.parseLong(String.valueOf(item[0]))).distance(Double.valueOf(String.valueOf(item[1]))).build();
            carrierDistanceDTOS.add(carrierDistanceDTO);
        }

        return  carrierDistanceDTOS;
    }
}
