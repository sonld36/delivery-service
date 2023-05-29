package com.mock.qlgiaohangback.dto.order;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.dto.user.AccountRespDTO;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.Date;

@Data
@RequiredArgsConstructor
public class OrderLogRespDTO {
    private Long id;

    private AccountRespDTO account;

    private OrderRespDTO order;

    private Constans.OrderLogAction action;

    private Constans.OrderStatus toStatus;

    private Date createdAt;

    private Date modifiedAt;

}
