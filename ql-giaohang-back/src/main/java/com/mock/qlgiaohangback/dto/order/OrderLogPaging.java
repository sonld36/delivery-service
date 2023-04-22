package com.mock.qlgiaohangback.dto.order;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OrderLogPaging {
    private List<OrderLogRespDTO> orderLogs;
    private int totalPage;
}
