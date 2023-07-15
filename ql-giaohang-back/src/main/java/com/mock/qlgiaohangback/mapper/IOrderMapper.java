package com.mock.qlgiaohangback.mapper;

import com.mock.qlgiaohangback.dto.order.OrderCreateDTO;
import com.mock.qlgiaohangback.dto.order.OrderRespDTO;
import com.mock.qlgiaohangback.dto.order.OrderRespodieuphoiGeneralDTO;
import com.mock.qlgiaohangback.entity.OrderEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(uses = {IShopMapper.class, ICustomerMapper.class, IOrderProductMapper.class})
public interface IOrderMapper {
    IOrderMapper INSTANCE = Mappers.getMapper(IOrderMapper.class);
//    OrderRespShipperDTO toOrderRespShipperDTO(OrderEntity order);

    @Mapping(source = "orderProductEntities", target = "products")
    @Mapping(source = "carrier.id",target = "carrierId")
    @Mapping(target = "currentLong", ignore = true)
    @Mapping(target = "currentLat", ignore = true)
    OrderRespDTO toOrderRespDTO(OrderEntity order);

    @Mapping(source = "products", target = "orderProductEntities")
    OrderEntity toEntity(OrderCreateDTO orderCreateDTO);

    List<OrderRespDTO> toListOrderRespDTO(List<OrderEntity> orderEntities);

    OrderEntity fromRespDtoToEntity(OrderRespDTO orderRespDTO);

    List<OrderRespodieuphoiGeneralDTO> toOrderRespoDPhoiGeneralDTO(List<OrderEntity> orderEntities);
}

