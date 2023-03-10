package com.mock.qlgiaohangback.service.impl;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.dto.address.AddressDTO;
import com.mock.qlgiaohangback.entity.AddressEntity;
import com.mock.qlgiaohangback.entity.CustomerEntity;
import com.mock.qlgiaohangback.entity.ShopEntity;
import com.mock.qlgiaohangback.exception.ResponseException;
import com.mock.qlgiaohangback.mapper.IAddressMapper;
import com.mock.qlgiaohangback.repository.AddressRepository;
import com.mock.qlgiaohangback.service.IAddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService implements IAddressService {

    private final AddressRepository addressRepository;

    @Override
    public List<AddressEntity> saveAddressesForShop(List<AddressEntity> addresses) {
        List<AddressEntity> addressEntities = addresses.stream().map(item -> {
            item.setActive(true);
            return item;
        }).collect(Collectors.toList());
        return addressRepository.saveAll(addressEntities);
    }

    @Override
    public AddressDTO addAddressForCustomer(AddressDTO addressDTO, CustomerEntity customer) {
        AddressEntity address = IAddressMapper.INSTANCE.toEntity(addressDTO);
        address.setCustomer(customer);
        address.setActive(true);
        return IAddressMapper.INSTANCE.toDTO(this.addressRepository.save(address));

//        return null;
    }

    @Override
    public AddressDTO getAddressByShop(ShopEntity shop) {
        return IAddressMapper.INSTANCE.toDTO(this.addressRepository.getByShopAndActiveIsTrue(shop));
    }

    @Override
    @Transactional
    public Integer deleteAddressByIdAndCustomerId(Long addressId, Long customerId) {
        try {
            Integer res = this.addressRepository.deleteByIdAndCustomerId(addressId, customerId)
                    .orElseThrow(() -> {throw new ResponseException(MessageResponse.NOT_EXISTED,
                            HttpStatus.BAD_REQUEST,
                            Constans.Code.INVALID.getCode());
                    });
            return res;
        } catch (Exception e) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            throw new ResponseException(e.getMessage(), HttpStatus.BAD_REQUEST, Constans.Code.INVALID.getCode());
        }
    }
}
