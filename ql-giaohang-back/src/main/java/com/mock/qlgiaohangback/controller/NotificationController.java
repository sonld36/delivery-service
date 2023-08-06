package com.mock.qlgiaohangback.controller;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.common.ResponseHandler;
import com.mock.qlgiaohangback.service.INotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping(value = "/v2", params = {"page"})
    public ResponseEntity getNotifyByAccountV2(@RequestParam("page") int page) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND, Constans.Code.OK.getCode(), HttpStatus.OK, this.notificationService.getNotificationByAccountV2(page));
    }

    @GetMapping("/count-not-seen")
    public ResponseEntity seenNotification() {
        return ResponseHandler.generateResponse(MessageResponse.FOUND, Constans.Code.OK.getCode(), HttpStatus.OK, this.notificationService.seenNotification());
    }

    @PutMapping("/seen/{id}")
    public ResponseEntity setSeen(@PathVariable("id") long id) {
        return ResponseHandler.generateResponse(MessageResponse.UPDATE_SUCCESS, Constans.Code.UPDATE_SUCCESSFUL.getCode(), HttpStatus.OK, this.notificationService.setSeen(id));
    }


}
