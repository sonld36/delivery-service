package com.mock.qlgiaohangback.dto.shop;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ShopInfoForManager {
    private long id;
    private String username;
    private String email;
    private String phoneNumber;
    private String address;
    private double totalCashPaid;
    private double totalCashToRefund;
}
