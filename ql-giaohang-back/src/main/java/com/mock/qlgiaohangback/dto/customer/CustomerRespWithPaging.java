package com.mock.qlgiaohangback.dto.customer;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
//@RequiredArgsConstructor
@Builder

public class CustomerRespWithPaging {
    private Integer totalPage;
    private List<CustomerRespDTO> customers;
}
