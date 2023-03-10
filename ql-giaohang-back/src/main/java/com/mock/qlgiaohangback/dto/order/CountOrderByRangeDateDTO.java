package com.mock.qlgiaohangback.dto.order;

import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class CountOrderByRangeDateDTO {
    Integer countOrder;
    Date dateCreate;
    String status;
}
