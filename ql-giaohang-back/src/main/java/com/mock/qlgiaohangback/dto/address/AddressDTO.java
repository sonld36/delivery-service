package com.mock.qlgiaohangback.dto.address;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class AddressDTO {

    private Long id;
    private String addressDetail;

    private Integer provinceCode;

    private Integer districtCode;

    private Integer wardCode;
}
