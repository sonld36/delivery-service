package com.mock.qlgiaohangback.dto.order;

import com.mock.qlgiaohangback.dto.address.AddressDTO;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.Date;

@Data
@RequiredArgsConstructor
public class OrderRespInfDetailDTO {
    private Date createdAt;
    private String shopName;
    private AddressDTO shopAdd;
    private String shopPhone;
    private String receiverName;
    private AddressDTO receiverAdd;
    private String receiverPhone;
    private String deliveryName;
    private String deliveryId;
    private String deliveryPhone;
    private String note;
    private String status;
}