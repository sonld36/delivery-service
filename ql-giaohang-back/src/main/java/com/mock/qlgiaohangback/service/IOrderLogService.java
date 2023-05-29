package com.mock.qlgiaohangback.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.dto.order.OrderLogPaging;
import com.mock.qlgiaohangback.dto.order.OrderRespDTO;

public interface IOrderLogService {
    int save(OrderRespDTO newOrder, Constans.OrderLogAction action) throws JsonProcessingException;

    OrderLogPaging findOrderLog(Integer page);

    OrderLogPaging findOrderLogByShop(Integer page);
}
