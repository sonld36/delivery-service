package com.mock.qlgiaohangback.mapper;

import com.mock.qlgiaohangback.dto.shop.ShopRegisterDTO;
import com.mock.qlgiaohangback.dto.user.AccountRegisterDTO;
import com.mock.qlgiaohangback.dto.user.AccountRespDTO;
import com.mock.qlgiaohangback.dto.user.AccountUpdateDTO;
import com.mock.qlgiaohangback.entity.AccountEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface IAccountMapper {

    IAccountMapper INSTANCE = Mappers.getMapper(IAccountMapper.class);

    @Mapping(source = "account.role.name", target = "role")
    AccountRespDTO toResponseDTO(AccountEntity account);

    AccountRegisterDTO shopRegisterToAccountRegister(ShopRegisterDTO shopRegisterDTO);

    @Mapping(source = "image", target = "pathAvatar", ignore = true)
    AccountEntity toEntity(AccountUpdateDTO accountUpdateDTO);

    AccountEntity toRegisterEntity(AccountRegisterDTO accountRegisterDTO);

}
