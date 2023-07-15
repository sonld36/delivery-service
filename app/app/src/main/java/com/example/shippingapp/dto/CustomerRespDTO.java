package com.example.shippingapp.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class CustomerRespDTO implements Serializable {
    private Long id;

    private String name;

    private String phoneNumber;

    private Long shopId;

    private List<AddressDTO> addresses;
}
