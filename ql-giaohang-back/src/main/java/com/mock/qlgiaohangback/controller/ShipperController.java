package com.mock.qlgiaohangback.controller;

import com.mock.qlgiaohangback.service.IShipperService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/shipper")
@RequiredArgsConstructor

public class ShipperController {
    private final IShipperService shipperService;

}
