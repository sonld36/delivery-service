package com.mock.qlgiaohangback.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.dto.order.OrderLogPaging;
import com.mock.qlgiaohangback.dto.order.OrderLogRespDTO;
import com.mock.qlgiaohangback.dto.order.OrderRespDTO;
import com.mock.qlgiaohangback.entity.AccountEntity;
import com.mock.qlgiaohangback.entity.OrderProcessLogEntity;
import com.mock.qlgiaohangback.entity.ShopEntity;
import com.mock.qlgiaohangback.exception.ResponseException;
import com.mock.qlgiaohangback.mapper.IOrderLogMapper;
import com.mock.qlgiaohangback.mapper.IOrderMapper;
import com.mock.qlgiaohangback.repository.OrderProcessLogRepository;
import com.mock.qlgiaohangback.repository.ShopRepository;
import com.mock.qlgiaohangback.service.IAccountService;
import com.mock.qlgiaohangback.service.INotificationService;
import com.mock.qlgiaohangback.service.IOrderLogService;
import com.mock.qlgiaohangback.service.IShopService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@Log4j2
@RequiredArgsConstructor
public class OrderLogService implements IOrderLogService {
    private final OrderProcessLogRepository orderProcessLogRepository;
    private final IAccountService accountService;
    private final ShopRepository shopRepository;

    private final INotificationService notificationService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Override
    public int save(OrderRespDTO newOrder, Constans.OrderLogAction action) throws JsonProcessingException {
        AccountEntity currAccount = this.accountService.getCurrentAccount();
        ShopEntity shop = shopRepository.findShopById(newOrder.getShop().getId());

        OrderProcessLogEntity orderProcessLogEntity = new OrderProcessLogEntity();
        orderProcessLogEntity.setOrder(IOrderMapper.INSTANCE.fromRespDtoToEntity(newOrder));
        orderProcessLogEntity.setAction(action);
        orderProcessLogEntity.setToStatus(newOrder.getStatus());
        orderProcessLogEntity.setAccount(currAccount);
        orderProcessLogEntity.setOwner(shop);

        OrderLogRespDTO logged = IOrderLogMapper.INSTANCE.toDTO(this.orderProcessLogRepository.save(orderProcessLogEntity));

        String logTopic = "/" + StringUtils.lowerCase(Constans.SocketTopic.LOG.name()) + "/" + shop.getAccount().getId();
        String logAllTopic = "/" + StringUtils.lowerCase(Constans.SocketTopic.LOG.name()) + "/order/all" ;
        simpMessagingTemplate.convertAndSend(logAllTopic, logged);
        log.info("Socket SEND all" + logAllTopic + " --- message: " + logged);
        this.notificationService.createNotify(logTopic, logged, null, currAccount, Constans.SocketTopic.LOG);
        return 1;
    }

    @Override
    public OrderLogPaging findOrderLog(Integer page) {
        if (page < 1) throw new ResponseException(MessageResponse.VALUE_PASSED_INCORRECT, HttpStatus.BAD_REQUEST, Constans.Code.INVALID.getCode());
        Page<OrderProcessLogEntity> orderLogs = this.orderProcessLogRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page - 1, 10));
        return OrderLogPaging.builder()
                .orderLogs(IOrderLogMapper.INSTANCE.toListDTO(orderLogs.getContent()))
                .totalPage(orderLogs.getTotalPages()).build();
    }

    @Override
    public OrderLogPaging findOrderLogByShop(Integer page) {
        if (page < 1) throw new ResponseException(MessageResponse.VALUE_PASSED_INCORRECT, HttpStatus.BAD_REQUEST, Constans.Code.INVALID.getCode());
        AccountEntity shop = this.accountService.getCurrentAccount();
        Page<OrderProcessLogEntity> orderLogs = this.orderProcessLogRepository.findAllByOrder_ShopAccountOrderByCreatedAtDesc(shop, PageRequest.of(page - 1, 10));
        return OrderLogPaging.builder()
                .orderLogs(IOrderLogMapper.INSTANCE.toListDTO(orderLogs.getContent()))
                .totalPage(orderLogs.getTotalPages()).build();
    }
}
