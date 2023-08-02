package com.mock.qlgiaohangback.controller;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.common.ResponseHandler;
import com.mock.qlgiaohangback.dto.carrier.CarrierRespDTO;
import com.mock.qlgiaohangback.mapper.ICarrierMapper;
import com.mock.qlgiaohangback.service.ICarrierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("carrier")
@RequiredArgsConstructor
public class CarrierController {

    private final ICarrierService carrierService;

    @GetMapping
    public ResponseEntity getCurrentCarrier() {
        return ResponseHandler.generateResponse(MessageResponse.FOUND, Constans.Code.OK.getCode(), HttpStatus.OK, this.carrierService.getCurrentCarrier());
    }



    @GetMapping(params = {"page"})
    public ResponseEntity getAll(@RequestParam("page") int page) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND, Constans.Code.OK.getCode(), HttpStatus.OK, this.carrierService.getAll(page));
    }

    @GetMapping("all")
    public ResponseEntity getAllWithoutPaging() {
        return ResponseHandler.generateResponse(MessageResponse.FOUND, Constans.Code.OK.getCode(), HttpStatus.OK, this.carrierService.getAllWithoutPaging());
    }

    @GetMapping(value = "/detail/{id}")
    public ResponseEntity getDetailFollowOrder(@PathVariable int id) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND, Constans.Code.OK.getCode(), HttpStatus.OK, this.carrierService.getDetailFollowOrder(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity getById(@PathVariable("id") long id) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND, Constans.Code.OK.getCode(),
                HttpStatus.OK,
                ICarrierMapper.INSTANCE.entityToRespDTO(this.carrierService.getCarrierById(id)));
    }

    @GetMapping("recommend/{shopId}")
    public ResponseEntity getCarrierByShopId(@PathVariable("shopId") long id) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND, Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.carrierService.getByShopId(id)
                );
    }

    @PutMapping(value = "/{id}", params = {"active", "geometric"})
    public ResponseEntity updateStatusById(@PathVariable("id") long id, @RequestParam("active") boolean active, @RequestParam("geometric") String geometric) {
        return ResponseHandler.generateResponse(MessageResponse.UPDATE_SUCCESS, Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.carrierService.updateCarrierActiveById(id, active, geometric));
    }

    @PutMapping("/reject-order/{id}")
    public ResponseEntity rejectOrder(@PathVariable("id") long orderId) {
        return ResponseHandler.generateResponse(MessageResponse.UPDATE_SUCCESS, Constans.Code.UPDATE_ACCOUNT_SUCCESSFULL.getCode(), HttpStatus.OK, this.carrierService.rejectOrder(orderId));
    }



}
