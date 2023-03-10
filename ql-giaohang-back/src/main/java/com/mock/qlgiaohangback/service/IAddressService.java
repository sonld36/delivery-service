package com.mock.qlgiaohangback.service;

import com.mock.qlgiaohangback.dto.address.AddressDTO;
import com.mock.qlgiaohangback.entity.AddressEntity;
import com.mock.qlgiaohangback.entity.CustomerEntity;
import com.mock.qlgiaohangback.entity.ShopEntity;

import java.util.List;

public interface IAddressService {
    List<AddressEntity> saveAddressesForShop(List<AddressEntity> addresses);

    AddressDTO addAddressForCustomer(AddressDTO addressDTO, CustomerEntity customer);

    AddressDTO getAddressByShop(ShopEntity shop);

    Integer deleteAddressByIdAndCustomerId(Long addressId, Long customerId);
}
