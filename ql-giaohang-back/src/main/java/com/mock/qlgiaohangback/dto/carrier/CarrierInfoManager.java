package com.mock.qlgiaohangback.dto.carrier;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class CarrierInfoManager {
    private long id;
    private String name;
    private String phoneNumber;
    private long orderDelivering;
    private double cashNotRefundYet;

    private boolean statusDelivery;
}
