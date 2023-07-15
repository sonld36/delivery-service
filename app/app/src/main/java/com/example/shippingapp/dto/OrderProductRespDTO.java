package com.example.shippingapp.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class OrderProductRespDTO implements Serializable {
    private ProductRespDTO product;

    private Integer productQuantity;

    private Integer productPrice;
}
