package com.mock.qlgiaohangback.dto.cod;
import com.mock.qlgiaohangback.dto.order.OrderRespDTO;
import com.mock.qlgiaohangback.entity.ShopEntity;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@RequiredArgsConstructor
public class CODInfoRespDTO {
    private Long id;
    private String date;
    private Long shopId;
    private List<OrderRespDTO> orders;

    private Integer status;

    private Date createdAt;
}
