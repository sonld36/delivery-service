package com.mock.qlgiaohangback.dto.product;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductTop10DTO {
    private Integer totalByStatus;
    private String status;
    private Long productId;
    private String productName;
}
