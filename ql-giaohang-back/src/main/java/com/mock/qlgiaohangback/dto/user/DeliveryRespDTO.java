package com.mock.qlgiaohangback.dto.user;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class DeliveryRespDTO {
    private String deliveryId;
    private String deliveryName;
    private String deliveryPhone;

}
