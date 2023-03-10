package com.mock.qlgiaohangback.dto.order_product;

import com.mock.qlgiaohangback.dto.product.ProductRespDTO;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class OrderProductRespDTO {

//    private Long orderId;
//
//    private Long productId;

//    private OrderRespShipperDTO order;

    private ProductRespDTO product;

    private Integer productQuantity;

    private Integer productPrice;
}
