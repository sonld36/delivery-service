package com.mock.qlgiaohangback.dto.shop;

import com.mock.qlgiaohangback.dto.address.AddressDTO;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import javax.validation.constraints.NotEmpty;
import java.util.List;

@RequiredArgsConstructor
@Data
public class PartnersRegistrationDTO {

    @NotEmpty(message = "Phone number should be not empty")
    private String phoneNumber;

    @NotEmpty(message = "Name should be not empty")
    private String name;

    @NotEmpty(message = "Address should be not empty")
    private List<AddressDTO> addresses;
}
