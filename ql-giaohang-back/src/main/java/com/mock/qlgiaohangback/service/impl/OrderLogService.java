package com.mock.qlgiaohangback.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.dto.order.OrderLogPaging;
import com.mock.qlgiaohangback.dto.order.OrderLogRespDTO;
import com.mock.qlgiaohangback.dto.order.OrderRespDTO;
import com.mock.qlgiaohangback.entity.AccountEntity;
import com.mock.qlgiaohangback.entity.OrderProcessLogEntity;
import com.mock.qlgiaohangback.exception.ResponseException;
import com.mock.qlgiaohangback.mapper.IOrderLogMapper;
import com.mock.qlgiaohangback.mapper.IOrderMapper;
import com.mock.qlgiaohangback.repository.OrderProcessLogRepository;
import com.mock.qlgiaohangback.service.IAccountService;
import com.mock.qlgiaohangback.service.INotificationService;
import com.mock.qlgiaohangback.service.IOrderLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@Log4j2
@RequiredArgsConstructor
public class OrderLogService implements IOrderLogService {
    private final OrderProcessLogRepository orderProcessLogRepository;
    private final IAccountService accountService;

    private final INotificationService notificationService;

    @Override
    public int save(OrderRespDTO oldOrder, OrderRespDTO newOrder, Constans.OrderLogAction action) throws JsonProcessingException {
        AccountEntity currAccount = this.accountService.getCurrentAccount();

        OrderProcessLogEntity orderProcessLogEntity = new OrderProcessLogEntity();
        orderProcessLogEntity.setOrder(IOrderMapper.INSTANCE.fromRespDtoToEntity(newOrder));
        orderProcessLogEntity.setAction(action);
        orderProcessLogEntity.setFromStatus(oldOrder.getStatus());
        orderProcessLogEntity.setToStatus(newOrder.getStatus());
        orderProcessLogEntity.setAccount(currAccount);

        OrderLogRespDTO logged = IOrderLogMapper.INSTANCE.toDTO(this.orderProcessLogRepository.save(orderProcessLogEntity));

        String logTopic = "/" + StringUtils.lowerCase(Constans.SocketTopic.LOG.name()) + Constans.OrderLogTopic.ALL.getTopic();

        this.notificationService.createNotify(logTopic, logged, null, currAccount, Constans.SocketTopic.LOG);
        return 1;
    }

    @Override
    public OrderLogPaging findOrderLog(Integer page) {
        if (page < 1) throw new ResponseException(MessageResponse.VALUE_PASSED_INCORRECT, HttpStatus.BAD_REQUEST, Constans.Code.INVALID.getCode());
        Page<OrderProcessLogEntity> orderLogs = this.orderProcessLogRepository.findAllByOrderByCreatedAt(PageRequest.of(page - 1, 10));
        return OrderLogPaging.builder()
                .orderLogs(IOrderLogMapper.INSTANCE.toListDTO(orderLogs.getContent()))
                .totalPage(orderLogs.getTotalPages()).build();
    }
}
