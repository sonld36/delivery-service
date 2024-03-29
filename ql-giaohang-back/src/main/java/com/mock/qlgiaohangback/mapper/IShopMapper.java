package com.mock.qlgiaohangback.mapper;

import com.mock.qlgiaohangback.dto.shop.PartnersRegistrationDTO;
import com.mock.qlgiaohangback.dto.shop.ShopDetailRespDTO;
import com.mock.qlgiaohangback.dto.shop.ShopInfoRespDTO;
import com.mock.qlgiaohangback.dto.shop.ShopRegisterDTO;
import com.mock.qlgiaohangback.entity.ShopEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(uses = {IAddressMapper.class, ICustomerMapper.class, IAccountMapper.class})
public interface IShopMapper {
    IShopMapper INSTANCE = Mappers.getMapper(IShopMapper.class);

    ShopEntity fromRegisterToEntity(ShopRegisterDTO shopRegisterDTO);
    @Mapping(source = "account.username", target = "username")
    @Mapping(source = "account.name", target = "name")
    @Mapping(source = "account.phoneNumber", target = "phoneNumber")
    ShopInfoRespDTO fromEntityToInfoRespDTO(ShopEntity shopEntity);

    @Mapping(source = "partnersRegistrationDTO.name", target = "account.name")
    @Mapping(source = "partnersRegistrationDTO.phoneNumber", target = "account.phoneNumber")
    ShopEntity fromPartnersToEntity(PartnersRegistrationDTO partnersRegistrationDTO);

    ShopDetailRespDTO fromEntityToDetailRespDTO(ShopEntity shopEntity);

    List<ShopDetailRespDTO> fromEntitiesToDetailResponse(List<ShopEntity> shopEntities);
}
