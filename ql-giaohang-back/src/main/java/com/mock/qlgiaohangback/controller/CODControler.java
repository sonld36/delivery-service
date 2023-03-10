package com.mock.qlgiaohangback.controller;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.common.ResponseHandler;
import com.mock.qlgiaohangback.dto.cod.CODByDateAndShopId;
import com.mock.qlgiaohangback.dto.cod.ChangeStatusDTO;
import com.mock.qlgiaohangback.service.ICODService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cod")
@RequiredArgsConstructor
public class CODControler {
    private final ICODService icodService;

    @PostMapping("/find-by-date-and-shop-id")
    public ResponseEntity findByDateAndShopId(@RequestBody CODByDateAndShopId body) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.icodService.getCOD(body));
    }

    @PostMapping("")
    public ResponseEntity createCOD(@RequestBody CODByDateAndShopId body){
        return ResponseHandler.generateResponse(MessageResponse.CREATED_SUCCESS,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.icodService.createCOD(body));
    }

    @PostMapping("pay-cod")
    public ResponseEntity payCOD(@RequestBody CODByDateAndShopId body) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.icodService.payCOD(body));
    }
    @GetMapping("/done")
    public ResponseEntity getCodDone(@RequestParam("page") Integer page) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.icodService.getCodDone(page));
    }

    @GetMapping
    public ResponseEntity getCOD(@RequestParam("status") Integer status, @RequestParam("page") Integer page ){
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.icodService.getCODsByStatus(status, page));
    }



    @PutMapping("/status")
    public ResponseEntity changeStatus(@RequestBody ChangeStatusDTO changeStatusDTO) {
        return ResponseHandler.generateResponse(MessageResponse.UPDATE_SUCCESS,
                Constans.Code.UPDATE_SUCCESSFUL.getCode(),
                HttpStatus.ACCEPTED,
                this.icodService.updateStatus(changeStatusDTO.getIdCod(), changeStatusDTO.getStatus())
                );
    }



}
