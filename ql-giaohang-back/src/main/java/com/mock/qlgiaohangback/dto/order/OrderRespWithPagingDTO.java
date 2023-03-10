package com.mock.qlgiaohangback.dto.order;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class OrderRespWithPagingDTO {
    private List<OrderRespDTO> orders;
    private int totalPage;
}
