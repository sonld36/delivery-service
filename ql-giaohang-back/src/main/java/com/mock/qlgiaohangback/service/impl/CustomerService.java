package com.mock.qlgiaohangback.service.impl;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.dto.address.AddressDTO;
import com.mock.qlgiaohangback.dto.customer.CustomerCreateDTO;
import com.mock.qlgiaohangback.dto.customer.CustomerRespDTO;
import com.mock.qlgiaohangback.dto.customer.CustomerRespWithPaging;
import com.mock.qlgiaohangback.entity.AddressEntity;
import com.mock.qlgiaohangback.entity.CustomerEntity;
import com.mock.qlgiaohangback.entity.ShopEntity;
import com.mock.qlgiaohangback.exception.ResponseException;
import com.mock.qlgiaohangback.mapper.IAddressMapper;
import com.mock.qlgiaohangback.mapper.ICustomerMapper;
import com.mock.qlgiaohangback.repository.CustomerRepository;
import com.mock.qlgiaohangback.service.IAddressService;
import com.mock.qlgiaohangback.service.ICustomerService;
import com.mock.qlgiaohangback.service.IShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService implements ICustomerService {

    private final CustomerRepository customerRepository;

    private final IShopService shopService;

    private final IAddressService addressService;

    @Override
    public CustomerRespWithPaging getAll(Integer page) {
        if (page < 1) {
            throw new ResponseException(MessageResponse.VALUE_PASSED_INCORRECT,
                    HttpStatus.BAD_REQUEST,
                    Constans.Code.INVALID.getCode());
        }

        ShopEntity shop = this.shopService.getShopLoggedIn();
        Page<CustomerEntity> customerEntity = this.customerRepository
                .findByShopIdOrderByCreatedAt(shop.getId(),
                        PageRequest.of(page - 1,
                                Integer.parseInt(Constans.CommonConstant.SIZE_PAGE.getSomeThing().toString()
                                )
                        )
                );
        return CustomerRespWithPaging.builder()
                .totalPage(customerEntity.getTotalPages())
                .customers(ICustomerMapper.INSTANCE.toListDTO(customerEntity.getContent()))
                .build();
    }

    @Override
    public CustomerRespDTO create(CustomerCreateDTO customerCreateDTO) {
        CustomerEntity customer = ICustomerMapper.INSTANCE.toEntityCreate(customerCreateDTO);
        ShopEntity shopEntity = this.shopService.getShopLoggedIn();
        if (this.customerRepository.existsByPhoneNumberAndShopId(customer.getPhoneNumber(), shopEntity.getId())) {
            throw new ResponseException(MessageResponse.EXISTED, HttpStatus.BAD_REQUEST, Constans.Code.EXISTED.getCode());
        }

        AddressEntity address = IAddressMapper.INSTANCE.toEntity(customerCreateDTO.getAddress());


        customer.setShop(shopEntity);
        customer.setAddresses(List.of(address));
        address.setCustomer(customer);

        return ICustomerMapper.INSTANCE.toDTO(this.customerRepository.save(customer));

    }

    @Override
    public CustomerEntity getCustomerByPhoneNumber(String phoneNumber) {
        return this.customerRepository.findByPhoneNumber(phoneNumber).get();
    }

    @Override
    public List<CustomerRespDTO> searchCustomerByPhoneNumber(String phoneNumber) {
        ShopEntity shop = this.shopService.getShopLoggedIn();
        return ICustomerMapper.INSTANCE
                .toListDTO(this.customerRepository
                        .findByPhoneNumberContainingAndShop_Id(phoneNumber, shop.getId())
                );
    }

    @Override
    public AddressDTO createAddress(AddressDTO addressDTO, Long customerId) {
        CustomerEntity customer = getCustomerById(customerId);

        return this.addressService.addAddressForCustomer(addressDTO, customer);
    }

    @Override
    @Transactional
    public Integer deleteAddress(Long addressId, Long customerId) {
        try {
            Integer res = this.addressService.deleteAddressByIdAndCustomerId(addressId, customerId);
            return res;
        } catch (Exception e) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            throw new ResponseException(e.getMessage(), HttpStatus.BAD_REQUEST, Constans.Code.INVALID.getCode());
        }
    }

    @Transactional
    @Override
    public Integer deleteCustomer(Long customerId) {
        this.customerRepository.deleteById(customerId);
        return 1;
    }

    public CustomerEntity getCustomerById(Long id) {
        return this.customerRepository.findById(id).orElseThrow(() -> {
            throw new ResponseException(MessageResponse.NOT_EXISTED,
                    HttpStatus.BAD_REQUEST,
                    Constans.Code.NOT_EXITED.getCode());
        });
    }
}
