package com.mock.qlgiaohangback.service;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.dto.address.AddressDTO;
import com.mock.qlgiaohangback.dto.shop.ShopDetailRespDTO;
import com.mock.qlgiaohangback.dto.shop.ShopInfoRespDTO;
import com.mock.qlgiaohangback.dto.shop.ShopRegisterDTO;
import com.mock.qlgiaohangback.entity.ShopEntity;

import java.util.List;

public interface IShopService {
    ShopInfoRespDTO register(ShopRegisterDTO shopRegisterDTO);


    ShopEntity getShopByAccountId(Long accountId);

    ShopEntity getShopLoggedIn();

    List<ShopDetailRespDTO> getShopByStatus(Constans.ShopStatus status);

    List <ShopDetailRespDTO> getAll();
    ShopDetailRespDTO getShopById(Long id);

    ShopDetailRespDTO setShopStatus(Long id, Constans.ShopStatus status);


    AddressDTO getAddressForShop();
}
