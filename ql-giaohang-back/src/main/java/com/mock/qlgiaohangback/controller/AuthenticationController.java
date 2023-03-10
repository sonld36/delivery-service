package com.mock.qlgiaohangback.controller;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.common.ResponseHandler;
import com.mock.qlgiaohangback.dto.shop.ShopRegisterDTO;
import com.mock.qlgiaohangback.dto.user.AccountLoginDTO;
import com.mock.qlgiaohangback.dto.user.AccountRegisterDTO;
import com.mock.qlgiaohangback.service.IAuthenticationService;
import com.mock.qlgiaohangback.service.IShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping(path = "/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final IAuthenticationService authenticationService;
    private final IShopService shopService;


    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid AccountLoginDTO loginDTO) {
        return ResponseHandler.generateResponse(MessageResponse.LOGIN_SUCCESS,
                Constans.Code.LOGGED_IN.getCode(),
                HttpStatus.OK,
                this.authenticationService.login(loginDTO)
        );
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid AccountRegisterDTO registerDTO) {
        return ResponseHandler.generateResponse(MessageResponse.CREATED_SUCCESS,
                Constans.Code.SIGNUP_SUCCESSFUL.getCode(),
                HttpStatus.OK, this.authenticationService.register(registerDTO));
    }
    @PostMapping("/shop/register")
    public ResponseEntity shopRegister(@RequestBody @Valid ShopRegisterDTO shopRegisterDTO) {
        return ResponseHandler.generateResponse(MessageResponse.CREATED_SUCCESS,
                Constans.Code.SIGNUP_SUCCESSFUL.getCode(), HttpStatus.OK,
                this.shopService.register(shopRegisterDTO));
    }

    @PostMapping("/create-account")
    public ResponseEntity createAcc(@RequestBody @Valid AccountRegisterDTO registerDTO, @RequestParam String role) {
        return ResponseHandler.generateResponse(MessageResponse.CREATED_SUCCESS,
                Constans.Code.SIGNUP_SUCCESSFUL.getCode(),
                HttpStatus.OK, this.authenticationService.createAcc(registerDTO, role));
    }

}
