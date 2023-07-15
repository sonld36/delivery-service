package com.mock.qlgiaohangback.controller;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.common.ResponseHandler;
import com.mock.qlgiaohangback.service.INotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
@RequestMapping(path = "/notify")
public class NotificationController {

    private final INotificationService notificationService;

    @GetMapping(params = {"title"})
    public ResponseEntity getNotificationByTitle(@RequestParam("title") String title) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.notificationService.getNotificationByTitle(title));
    }


    @GetMapping(params = {"page"})
    public ResponseEntity getNotifyByAccount(@RequestParam("page") int page) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND, Constans.Code.OK.getCode(), HttpStatus.OK, this.notificationService.getNotificationByAccount(page));
    }

    @GetMapping("/count-not-seen")
    public ResponseEntity seenNotification() {
        return ResponseHandler.generateResponse(MessageResponse.FOUND, Constans.Code.OK.getCode(), HttpStatus.OK, this.notificationService.seenNotification());
    }


}
