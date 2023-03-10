package com.mock.qlgiaohangback.dto.order;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import javax.persistence.Column;

@Data
@RequiredArgsConstructor
public class OrderRespProductDetailDTO {
    private String name;
    private Integer productQuantity;
    private Integer productPrice;
    private Double weight;
    private String pathImage;

}
