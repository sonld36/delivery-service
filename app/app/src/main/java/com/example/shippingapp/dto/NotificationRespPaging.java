package com.example.shippingapp.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationRespPaging {
    private int total;
    private long numberNotSeen;
    private List<NotificationRespDTO> notificationRespDTOS;
}
