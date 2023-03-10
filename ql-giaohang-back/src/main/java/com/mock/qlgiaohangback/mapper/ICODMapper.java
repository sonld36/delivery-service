package com.mock.qlgiaohangback.mapper;

import com.mock.qlgiaohangback.dto.cod.CODInfoRespDTO;
import com.mock.qlgiaohangback.entity.CODEntity;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(uses={IShopMapper.class,IOrderMapper.class})
public interface ICODMapper {
    ICODMapper INSTANCE = Mappers.getMapper(ICODMapper.class);
    CODInfoRespDTO toDTO(CODEntity cod);

    List<CODInfoRespDTO> toListDTO(List<CODEntity> codEntities);
}
