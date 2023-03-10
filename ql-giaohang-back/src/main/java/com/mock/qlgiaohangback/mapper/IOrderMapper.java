package com.mock.qlgiaohangback.mapper;

import com.mock.qlgiaohangback.dto.order.OrderCreateDTO;
import com.mock.qlgiaohangback.dto.order.OrderRespDTO;
import com.mock.qlgiaohangback.dto.order.OrderRespodieuphoiGeneralDTO;
import com.mock.qlgiaohangback.entity.OrderEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(uses = {IShopMapper.class, ICustomerMapper.class, IAccountMapper.class, IOrderProductMapper.class})
public interface IOrderMapper {
    IOrderMapper INSTANCE = Mappers.getMapper(IOrderMapper.class);
//    OrderRespShipperDTO toOrderRespShipperDTO(OrderEntity order);

    @Mapping(source = "orderProductEntities", target = "products")
    OrderRespDTO toOrderRespDTO(OrderEntity order);

    @Mapping(source = "products", target = "orderProductEntities")
    OrderEntity toEntity(OrderCreateDTO orderCreateDTO);

    List<OrderRespDTO> toListOrderRespDTO(List<OrderEntity> orderEntities);

    List<OrderRespodieuphoiGeneralDTO> toOrderRespoDPhoiGeneralDTO(List<OrderEntity> orderEntities);
}

