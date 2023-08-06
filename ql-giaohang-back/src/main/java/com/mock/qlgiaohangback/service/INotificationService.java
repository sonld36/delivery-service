package com.mock.qlgiaohangback.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.dto.notification.NotificationRespDTO;
import com.mock.qlgiaohangback.dto.notification.NotificationRespPaging;
import com.mock.qlgiaohangback.dto.order.OrderRespDTO;
import com.mock.qlgiaohangback.entity.AccountEntity;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface INotificationService {
    int createNotify(String topic, Object message, AccountEntity destination, AccountEntity from, Constans.SocketTopic title) throws JsonProcessingException;

    List<NotificationRespDTO> getNotificationByTitle(String title);

    Map<String, Object> getNotificationByAccount(int page);

    NotificationRespPaging getNotificationByAccountV2(int page);

    int seenNotification();

    int setSeen(long id);


    int sendRequestShipping(List<String> topics, OrderRespDTO orderRespDTO);
}
