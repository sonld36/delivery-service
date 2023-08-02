package com.example.shippingapp.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Builder
@Getter
@Setter
@AllArgsConstructor
public class NotificationRespDTO {
    private long id;
    private String message;
    private String title;
    private boolean seen;
    private AccountRespDTO destination;
    private AccountRespDTO from;

    private Date createdAt;
}

