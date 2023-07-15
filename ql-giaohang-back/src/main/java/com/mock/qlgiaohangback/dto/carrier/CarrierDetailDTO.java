package com.mock.qlgiaohangback.dto.carrier;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class CarrierDetailDTO {
    private int numberOfOrderDelivering;
    private int numberOfOrderDelivered;
    private double totalCashNotPayment;
}
