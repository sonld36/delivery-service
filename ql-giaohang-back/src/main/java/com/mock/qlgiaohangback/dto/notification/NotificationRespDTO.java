package com.mock.qlgiaohangback.dto.notification;

import com.mock.qlgiaohangback.dto.user.AccountRespDTO;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.Date;

@Data
@RequiredArgsConstructor
public class NotificationRespDTO {
    private long id;
    private String message;
    private String title;
    private boolean seen;
    private AccountRespDTO destination;
    private AccountRespDTO from;

    private Date createdAt;
}
