package com.mock.qlgiaohangback.dto.product;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
@RequiredArgsConstructor
public class ProductUpdateDTO {

    @NotNull(message = "Product should be have id")
    private Long id;

    @NotEmpty(message = "Product should be have name")
    private String name;

    @NotEmpty(message = "Product should be have product code")
    private String productCode;

    //    @NotNull(message = "Product should be have sale price")
    @Min(value = 0, message = "Price should be larger 0")
    private Integer salePrice;

    //    @NotNull(message = "Product should be have entry price")
    @Min(value = 0, message = "Price should be larger 0")
    private Integer entryPrice;

    //    @NotNull(message = "Product should be have weight")
    @Min(value = 0, message = "Weight should be larger 0")
    private Double weight;

    @NotNull
    private Boolean active;


    private MultipartFile image;
}
