package com.mock.qlgiaohangback.dto.shipper;

import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@Builder
public class ShipperResponsePaging<T> {
    private T data;
    private Integer totalPage;
}
