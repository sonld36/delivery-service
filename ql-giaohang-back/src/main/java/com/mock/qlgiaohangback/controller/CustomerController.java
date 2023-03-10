package com.mock.qlgiaohangback.controller;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.common.ResponseHandler;
import com.mock.qlgiaohangback.dto.address.AddressDTO;
import com.mock.qlgiaohangback.dto.customer.CustomerCreateDTO;
import com.mock.qlgiaohangback.service.ICustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final ICustomerService customerService;


    @GetMapping
    public ResponseEntity getAll(@RequestParam("page") Integer page) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.customerService.getAll(page));
    }

    @GetMapping("/search")
    public ResponseEntity getByPhoneNumber(@RequestParam String phoneNumber) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.customerService.searchCustomerByPhoneNumber(phoneNumber));
    }

    @PostMapping
    public ResponseEntity create(@RequestBody @Valid CustomerCreateDTO customerCreateDTO) {
        return ResponseHandler.generateResponse(MessageResponse.CREATED_SUCCESS,
                Constans.Code.CREATED_SUCCESS.getCode(),
                HttpStatus.CREATED,
                this.customerService.create(customerCreateDTO)
        );
    }

    @PostMapping("/{id}")
    public ResponseEntity createAddress(@RequestBody @Valid AddressDTO addressDTO, @PathVariable("id") Long id) {
        return ResponseHandler.generateResponse(MessageResponse.CREATED_SUCCESS,
                Constans.Code.CREATE_ADDRESS_SUCCESSFUL.getCode(),
                HttpStatus.CREATED,
                this.customerService.createAddress(addressDTO, id));
    }


    @DeleteMapping("/address/{id}")
    public ResponseEntity deleteAddress(@RequestParam("customerId") Long customerId, @PathVariable("id") Long addressId) {
        return ResponseHandler.generateResponse(MessageResponse.DELETE_SUCCESS,
                Constans.Code.DELETE_SUCCESSFUL.getCode(),
                HttpStatus.ACCEPTED,
                this.customerService.deleteAddress(addressId, customerId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteCustomer(@PathVariable Long id) {
        return ResponseHandler.generateResponse(MessageResponse.DELETE_SUCCESS,
                Constans.Code.DELETE_SUCCESSFUL.getCode(),
                HttpStatus.ACCEPTED,
                this.customerService.deleteCustomer(id));
    }
}
