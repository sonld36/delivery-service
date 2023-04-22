package com.mock.qlgiaohangback.mapper;

import com.mock.qlgiaohangback.dto.order.OrderLogRespDTO;
import com.mock.qlgiaohangback.entity.OrderProcessLogEntity;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(uses = {IAccountMapper.class})
public interface IOrderLogMapper {
    IOrderLogMapper INSTANCE = Mappers.getMapper(IOrderLogMapper.class);

    OrderLogRespDTO toDTO(OrderProcessLogEntity orderProcessLogEntity);

    List<OrderLogRespDTO> toListDTO(List<OrderProcessLogEntity> orderProcessLogEntities);
}
