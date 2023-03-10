package com.mock.qlgiaohangback.dto.customer;

import com.mock.qlgiaohangback.dto.address.AddressDTO;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
@Data
public class CustomerRespDTO {
    private Long id;

    private String name;

    private String phoneNumber;

    private Long shopId;

    private List<AddressDTO> addresses;


}
