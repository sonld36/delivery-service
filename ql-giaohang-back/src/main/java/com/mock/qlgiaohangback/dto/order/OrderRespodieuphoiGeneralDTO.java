package com.mock.qlgiaohangback.dto.order;

import com.mock.qlgiaohangback.common.Constans;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.Date;

@Data
@RequiredArgsConstructor
public class OrderRespodieuphoiGeneralDTO {
    private String maVanDon;
    private Date createdAt;
    private String receiverName;
    private String receiverPhone;
    private String carrierName;
    private String carrierPhone;
    private Constans.OrderStatus status;
}
