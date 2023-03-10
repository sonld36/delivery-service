package com.mock.qlgiaohangback.dto.product;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.Date;

@Data
@RequiredArgsConstructor
public class ProductRespDTO {
    private Long id;

    private String productCode;

    private String name;

    private Integer salePrice;

    private Integer entryPrice;


    private Double weight;

    private Boolean active;


    private String pathImage;

    private Long shopId;

//    private ShopInfoRespDTO shop;

//    private List<OrderProductRespDTO> orderProductEntities;

    private Date createdAt;

    private Date modifiedAt;

}
