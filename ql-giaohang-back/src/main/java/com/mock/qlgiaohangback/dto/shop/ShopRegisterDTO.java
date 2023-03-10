package com.mock.qlgiaohangback.dto.shop;

import com.mock.qlgiaohangback.dto.address.AddressDTO;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.List;

@RequiredArgsConstructor
@Data
public class ShopRegisterDTO implements Serializable {
    @Email(message = "Email is not valid", regexp = "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])")
    @NotEmpty(message = "Email cannot be empty")
    private String email;

    @NotEmpty(message = "Username cannot be empty")
    @Size(min = 8, message = "Username should be longer 8 characters")
    private String username;


    @NotEmpty(message = "Password cannot be empty")
    @Size(min = 6, message = "Password should be longer 6 character")
    private String password;

    @NotEmpty(message = "Phone number should be not empty")
    private String phoneNumber;

    @NotEmpty(message = "Name should be not empty")
    private String name;

    @NotEmpty(message = "Address should be not empty")
    private List<AddressDTO> addresses;
}
