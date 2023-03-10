package com.mock.qlgiaohangback.service;

import com.mock.qlgiaohangback.dto.address.AddressDTO;
import com.mock.qlgiaohangback.dto.customer.CustomerCreateDTO;
import com.mock.qlgiaohangback.dto.customer.CustomerRespDTO;
import com.mock.qlgiaohangback.dto.customer.CustomerRespWithPaging;
import com.mock.qlgiaohangback.entity.CustomerEntity;

import java.util.List;

public interface ICustomerService {
    CustomerRespWithPaging getAll(Integer page);

    CustomerRespDTO create(CustomerCreateDTO customerCreateDTO);

    CustomerEntity getCustomerByPhoneNumber(String phoneNumber);

    List<CustomerRespDTO> searchCustomerByPhoneNumber(String phoneNumber);

    AddressDTO createAddress(AddressDTO addressDTO, Long customerId);

    Integer deleteAddress(Long addressId, Long customerId);

    Integer deleteCustomer(Long customerId);
}
