package com.mock.qlgiaohangback.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.dto.notification.NotificationRespDTO;
import com.mock.qlgiaohangback.entity.AccountEntity;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface INotificationService {
    int createNotify(String topic, Object message, AccountEntity destination, AccountEntity from, Constans.SocketTopic title) throws JsonProcessingException;

    List<NotificationRespDTO> getNotificationByTitle(String title);
}
