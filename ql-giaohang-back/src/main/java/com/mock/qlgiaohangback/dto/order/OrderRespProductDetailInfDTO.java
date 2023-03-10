package com.mock.qlgiaohangback.dto.order;

import com.mock.qlgiaohangback.common.Constans;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Data
@RequiredArgsConstructor
public class OrderRespProductDetailInfDTO {
    private List<OrderRespProductDetailDTO> products ;
    private Constans.TypeOfDelivery type;
    private double deliveryFee;

}
