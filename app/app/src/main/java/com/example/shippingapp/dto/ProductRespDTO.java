package com.example.shippingapp.dto;

import java.io.Serializable;
import java.util.Date;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Data
public class ProductRespDTO implements Serializable {
    private Long id;

    private String productCode;

    private String name;

    private Integer salePrice;


    private Double weight;

    private Boolean active;


    private String pathImage;

    private Long shopId;

//    private ShopInfoRespDTO shop;

//    private List<OrderProductRespDTO> orderProductEntities;

    private Date createdAt;

    private Date modifiedAt;
}
