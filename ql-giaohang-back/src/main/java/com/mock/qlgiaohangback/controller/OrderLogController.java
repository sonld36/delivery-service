package com.mock.qlgiaohangback.controller;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.common.ResponseHandler;
import com.mock.qlgiaohangback.service.IOrderLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
@RequestMapping(path = "/order-log")
public class OrderLogController {

    private final IOrderLogService orderLogService;
    @GetMapping(params = {"page"})
    public ResponseEntity getOrderLog(@RequestParam("page") Integer page) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(), HttpStatus.OK,
                this.orderLogService.findOrderLog(page));
    }

    @GetMapping(params = {"page"}, path = "/forshop")
    public ResponseEntity getOrderLogForShop(@RequestParam("page") Integer page) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(), HttpStatus.OK,
                this.orderLogService.findOrderLogByShop(page));
    }
}
