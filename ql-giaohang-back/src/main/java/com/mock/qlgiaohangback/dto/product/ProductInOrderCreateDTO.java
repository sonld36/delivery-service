package com.mock.qlgiaohangback.dto.product;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@RequiredArgsConstructor
public class ProductInOrderCreateDTO {

    @NotNull
    private Long id;

    @NotNull
    private Integer quantity;

    @NotNull
    private Integer salePrice;
}
