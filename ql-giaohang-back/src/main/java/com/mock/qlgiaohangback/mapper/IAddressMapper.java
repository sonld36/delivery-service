package com.mock.qlgiaohangback.mapper;

import com.mock.qlgiaohangback.dto.address.AddressDTO;
import com.mock.qlgiaohangback.entity.AddressEntity;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface IAddressMapper {
    IAddressMapper INSTANCE = Mappers.getMapper(IAddressMapper.class);

    //    @Mapping(source = "entity.customer.id", target = "customerId")
    AddressDTO toDTO(AddressEntity entity);

    List<AddressDTO> toDTOs(List<AddressEntity> entities);


    AddressEntity toEntity(AddressDTO addressDTO);

    List<AddressEntity> toListEntity(List<AddressDTO> addressesDTO);

}
