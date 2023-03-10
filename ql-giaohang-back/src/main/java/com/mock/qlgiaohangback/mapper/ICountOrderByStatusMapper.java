package com.mock.qlgiaohangback.mapper;

import com.mock.qlgiaohangback.dto.order.CountOrderByStatusDTO;
import com.mock.qlgiaohangback.entity.OrderEntity;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ICountOrderByStatusMapper {
    ICountOrderByStatusMapper INSTANCE = Mappers.getMapper(ICountOrderByStatusMapper.class);

    CountOrderByStatusDTO toDTO(OrderEntity order);
}
