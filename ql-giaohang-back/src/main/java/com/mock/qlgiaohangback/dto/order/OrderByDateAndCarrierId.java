package com.mock.qlgiaohangback.dto.order;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.Date;

@Data
@RequiredArgsConstructor
public class OrderByDateAndCarrierId {
    private Long carrierId;
    private Date createdAt;
}
