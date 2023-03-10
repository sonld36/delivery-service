package com.mock.qlgiaohangback.dto.cod;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class CODByDateAndShopId {
    private Long shopId;
    private String date;
}
