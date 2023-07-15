package com.example.shippingapp.dto;


import java.io.Serializable;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Data
public class AddressDTO implements Serializable {
    private Long id;
    private String addressDetail;

    private Integer provinceCode;

    private Integer districtCode;

    private Integer wardCode;
}
