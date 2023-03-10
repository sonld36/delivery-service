package com.mock.qlgiaohangback.dto.product;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
//@RequiredArgsConstructor
public class ProductRespWithPagingDTO {
    private List<ProductRespDTO> products;
    private int totalPage;
}
