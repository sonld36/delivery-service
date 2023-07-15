package com.mock.qlgiaohangback.mapper;

import com.mock.qlgiaohangback.dto.carrier.CarrierCreateDTO;
import com.mock.qlgiaohangback.dto.carrier.CarrierRespDTO;
import com.mock.qlgiaohangback.dto.carrier.CarrierToRecommendDTO;
import com.mock.qlgiaohangback.entity.CarrierEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(uses = {IOrderMapper.class, IAccountMapper.class})
public interface ICarrierMapper {
    ICarrierMapper INSTANCE = Mappers.getMapper(ICarrierMapper.class);

    CarrierEntity createToEntity(CarrierCreateDTO carrierDTO);

    @Mapping(source = "account.id", target = "accountId")
    CarrierRespDTO entityToRespDTO(CarrierEntity carrierEntity);

    List<CarrierRespDTO> listEntityToListRespDTO(List<CarrierEntity> carrierEntities);

    @Mapping(source = "account.id", target = "accountId")
    CarrierToRecommendDTO toRecommendDTO(CarrierEntity carrierEntity);

    List<CarrierToRecommendDTO> toRecommendDTOs(List<CarrierEntity> carrierEntities);

    CarrierEntity recommendToEntity(CarrierToRecommendDTO carrier);
}
