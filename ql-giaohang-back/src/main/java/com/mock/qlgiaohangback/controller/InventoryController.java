package com.mock.qlgiaohangback.controller;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.common.ResponseHandler;
import com.mock.qlgiaohangback.dto.inventory.InventoryDTO;
import com.mock.qlgiaohangback.service.IInventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/inventory")
public class InventoryController {
    private final IInventoryService iInventoryService;

    @GetMapping
    public ResponseEntity get() {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.iInventoryService.getAll());
    }

    @PostMapping
    public ResponseEntity create(@RequestBody InventoryDTO inventoryDTO) {
        return ResponseHandler.generateResponse(MessageResponse.CREATED_SUCCESS,
                Constans.Code.CREATED_SUCCESS.getCode(),
                HttpStatus.OK,
                this.iInventoryService.create(inventoryDTO));
    }
}
