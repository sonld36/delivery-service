package com.mock.qlgiaohangback.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.common.ResponseHandler;
import com.mock.qlgiaohangback.dto.notification.NotificationRespDTO;
import com.mock.qlgiaohangback.dto.notification.NotificationRespPaging;
import com.mock.qlgiaohangback.dto.order.OrderRespDTO;
import com.mock.qlgiaohangback.entity.AccountEntity;
import com.mock.qlgiaohangback.entity.NotificationEntity;
import com.mock.qlgiaohangback.mapper.INotificationMapper;
import com.mock.qlgiaohangback.repository.NotificationRepository;
import com.mock.qlgiaohangback.service.IAccountService;
import com.mock.qlgiaohangback.service.INotificationService;
import com.mock.qlgiaohangback.service.IShopService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class NotificationService implements INotificationService {
    private final NotificationRepository notificationRepository;

    private final SimpMessagingTemplate simpMessagingTemplate;

    private final AccountService accountService;

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
        log.info("Socket SEND " + topic + " --- message: " + message);
        simpMessagingTemplate.convertAndSend(topic, message);

        return 1;
    }

    @Override
    public List<NotificationRespDTO> getNotificationByTitle(String title) {
        Page<NotificationEntity> notificationEntities = this.notificationRepository.getByTitleOrderByCreatedAt(title, PageRequest.of(1, 10));
        return INotificationMapper.INSTANCE.toListDTO(notificationEntities.getContent());
    }

    @Override
    public Map<String, Object> getNotificationByAccount(int page) {
        AccountEntity account = this.accountService.getCurrentAccount();
        Page<NotificationEntity> notificationEntities = this.notificationRepository.getNotificationEntitiesByDestinationOrderByCreatedAtDesc(account, PageRequest.of(page - 1, 10));
        List<NotificationEntity> notificationSeen = notificationEntities.getContent().stream().peek((item) -> item.setSeen(true)).collect(Collectors.toList());
        this.notificationRepository.saveAll(notificationSeen);

        return ResponseHandler.generateForPaging(notificationEntities.getTotalPages(), List.of(INotificationMapper.INSTANCE.toListDTO(notificationEntities.getContent()).toArray()));
    }

    @Override
    public NotificationRespPaging getNotificationByAccountV2(int page) {
        AccountEntity account = this.accountService.getCurrentAccount();
        Page<NotificationEntity> notificationEntities = this.notificationRepository.getNotificationEntitiesByDestinationOrderByCreatedAtDesc(account, PageRequest.of(page - 1, 20));
        List<NotificationEntity> notify = notificationEntities.getContent();
        long notSeen = notify.stream().filter(item -> !item.getSeen()).count();
        return NotificationRespPaging.builder()
                .notificationRespDTOS(INotificationMapper.INSTANCE.toListDTO(notify))
                .total(notificationEntities.getTotalPages())
                .numberNotSeen(notSeen).build();
    }

    @Override
    public int seenNotification() {
        AccountEntity account = this.accountService.getCurrentAccount();
        return this.notificationRepository.countNotificationEntitiesBySeenIsFalseAndDestination_Id(account.getId());
    }

    @Override
    public int setSeen(long id) {
        NotificationEntity notification = this.notificationRepository.getById(id);
        notification.setSeen(true);
        this.notificationRepository.save(notification);
        return 1;
    }

    @Override
    public int sendRequestShipping(List<String> topics, OrderRespDTO orderRespDTO) {
        try {
            topics.forEach((topic) -> {
                this.simpMessagingTemplate.convertAndSend(topic, orderRespDTO);
            });
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }


}
