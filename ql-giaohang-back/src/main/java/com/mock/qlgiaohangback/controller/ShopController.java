package com.mock.qlgiaohangback.controller;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.common.ResponseHandler;
import com.mock.qlgiaohangback.entity.ShopEntity;
import com.mock.qlgiaohangback.service.IShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/shop")
@RequiredArgsConstructor
public class ShopController {

    private final IShopService shopService;


    @GetMapping("")
    public ResponseEntity findAll(@RequestParam(required = false) Constans.ShopStatus status) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.shopService.getShopByStatus(status));
    }

    @GetMapping("/all")
    public ResponseEntity getAll() {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.shopService.getAll());
    }
    @GetMapping("address")
    public ResponseEntity getAddressByShopId() {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.shopService.getAddressForShop());
    }

    @GetMapping("profile")
    public ResponseEntity getProfileShop() {
        ShopEntity shop = this.shopService.getShopLoggedIn();
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.shopService.getShopById(shop.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity findById(@PathVariable("id") Long id) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.shopService.getShopById(id));
    }

    @GetMapping("/change-status/{id}")
    public ResponseEntity changeStatus(@PathVariable("id") Long id, @RequestParam Constans.ShopStatus status) {
        return ResponseHandler.generateResponse(MessageResponse.UPDATE_SUCCESS,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.shopService.setShopStatus(id, status));
    }


}
