package com.mock.qlgiaohangback.dto.notification;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class NotificationRespPaging {
    private int total;
    private long numberNotSeen;
    private List<NotificationRespDTO> notificationRespDTOS;
}
