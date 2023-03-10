package com.mock.qlgiaohangback.mapper;

import com.mock.qlgiaohangback.dto.customer.CustomerCreateDTO;
import com.mock.qlgiaohangback.dto.customer.CustomerRespDTO;
import com.mock.qlgiaohangback.entity.CustomerEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(uses = {IAddressMapper.class})
public interface ICustomerMapper {
    ICustomerMapper INSTANCE = Mappers.getMapper(ICustomerMapper.class);

    @Mapping(source = "shop.id", target = "shopId")
    CustomerRespDTO toDTO(CustomerEntity entity);

    //    @Mapping(source = "dto.address", target = "address[0]")
    CustomerEntity toEntityCreate(CustomerCreateDTO dto);

    List<CustomerRespDTO> toListDTO(List<CustomerEntity> entities);
}
