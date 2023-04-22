package com.mock.qlgiaohangback.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.dto.notification.NotificationRespDTO;
import com.mock.qlgiaohangback.entity.AccountEntity;
import com.mock.qlgiaohangback.entity.NotificationEntity;
import com.mock.qlgiaohangback.mapper.INotificationMapper;
import com.mock.qlgiaohangback.repository.NotificationRepository;
import com.mock.qlgiaohangback.service.IAccountService;
import com.mock.qlgiaohangback.service.INotificationService;
import com.mock.qlgiaohangback.service.IShopService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class NotificationService implements INotificationService {
    private final NotificationRepository notificationRepository;

    private final SimpMessagingTemplate simpMessagingTemplate;

    private final ObjectMapper objectMapper;

    @Override
    public int createNotify(String topic, Object message, AccountEntity destination, AccountEntity from, Constans.SocketTopic title) throws JsonProcessingException {
        NotificationEntity notification = new NotificationEntity();
        notification.setTitle(title.name());
        notification.setMessage(objectMapper.writeValueAsString(message));
        notification.setDestination(destination);
        notification.setSeen(false);
        notification.setFrom(from);

        this.notificationRepository.save(notification);

        simpMessagingTemplate.convertAndSend(topic, message);

        return 1;
    }

    @Override
    public List<NotificationRespDTO> getNotificationByTitle(String title) {
        Page<NotificationEntity> notificationEntities = this.notificationRepository.getByTitleOrderByCreatedAt(title, PageRequest.of(1, 10));
        return INotificationMapper.INSTANCE.toListDTO(notificationEntities.getContent());
    }

}
