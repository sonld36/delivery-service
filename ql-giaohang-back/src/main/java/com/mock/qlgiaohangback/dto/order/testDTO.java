package com.mock.qlgiaohangback.dto.order;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class testDTO {
    private int product_price;
    private int product_quantity;
    private int product_id;
    private int order_id;

}
