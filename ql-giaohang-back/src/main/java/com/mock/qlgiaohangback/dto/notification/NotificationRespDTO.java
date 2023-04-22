package com.mock.qlgiaohangback.dto.notification;

import com.mock.qlgiaohangback.dto.user.AccountRespDTO;

import java.util.Date;

public class NotificationRespDTO {
    private long id;
    private String message;
    private String title;
    private boolean seen;
    private AccountRespDTO destination;
    private AccountRespDTO from;

    private Date createAt;
}
