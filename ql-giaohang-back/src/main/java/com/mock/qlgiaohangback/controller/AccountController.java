package com.mock.qlgiaohangback.controller;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.common.ResponseHandler;
import com.mock.qlgiaohangback.dto.user.AccountUpdateDTO;
import com.mock.qlgiaohangback.service.IAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.IOException;

@RestController
@RequestMapping("/account")
@RequiredArgsConstructor
public class AccountController {
    private final IAccountService accountService;

    @GetMapping("/info")
    public ResponseEntity getAccountInfo() {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.accountService.getAccountInfo());
    }

    @PutMapping("/update")
    public ResponseEntity updateAccountInfo(
            @ModelAttribute @Valid AccountUpdateDTO accountUpdateDTO
    ) throws IOException {
        System.out.println("accountUpdateDTO: " + accountUpdateDTO);
        return ResponseHandler.generateResponse(MessageResponse.CREATED_SUCCESS,
                Constans.Code.UPDATE_ACCOUNT_SUCCESSFULL.getCode(),
                HttpStatus.OK,
                this.accountService
                        .updateAccountInfo(accountUpdateDTO)
        );
    }

    @GetMapping("{id}")
    public ResponseEntity getAccById(@PathVariable("id") Long id) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.accountService.getAccById(id));
    }

    @GetMapping("/get-list-inf-deliverier")
    public ResponseEntity getListInfDeliverier() {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.accountService.getInfDeliverier());
    }
    @GetMapping("")
    public  ResponseEntity getAll(){
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.accountService.getAll());
    }

}
