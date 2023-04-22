package com.mock.qlgiaohangback.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.dto.order.OrderLogPaging;
import com.mock.qlgiaohangback.dto.order.OrderLogRespDTO;
import com.mock.qlgiaohangback.dto.order.OrderRespDTO;
import com.mock.qlgiaohangback.entity.OrderProcessLogEntity;

import java.util.List;

public interface IOrderLogService {
    int save(OrderRespDTO oldOrder, OrderRespDTO newOrder, Constans.OrderLogAction action) throws JsonProcessingException;

    OrderLogPaging findOrderLog(Integer page);
}
