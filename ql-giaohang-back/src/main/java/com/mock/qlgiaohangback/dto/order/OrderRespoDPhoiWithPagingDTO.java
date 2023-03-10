package com.mock.qlgiaohangback.dto.order;

import lombok.Data;

import java.util.List;

@Data
public class OrderRespoDPhoiWithPagingDTO {
    private List<OrderRespodieuphoiGeneralDTO> orders;
    private Long totalRecord;
}
