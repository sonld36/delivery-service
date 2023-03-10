package com.mock.qlgiaohangback.dto.customer;

import com.mock.qlgiaohangback.dto.address.AddressDTO;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import javax.validation.constraints.NotEmpty;

@Data
@RequiredArgsConstructor
public class CustomerCreateDTO {

    @NotEmpty
    private String name;

    @NotEmpty
    private String phoneNumber;

    private AddressDTO address;
}
