package com.mock.qlgiaohangback.dto.user;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

@Data
@RequiredArgsConstructor
public class AccountRegisterDTO {

    @NotEmpty(message = "Username cannot be empty")
    @Size(min = 8, message = "Username should be longer 8 characters")
    private String username;

    @NotEmpty(message = "Password connot be empty")
    @Size(min = 6, message = "Username should be longer 6 characters")
    private String password;

    @NotEmpty(message = "Phone number should be not empty")
    private String phoneNumber;

    @NotEmpty(message = "Name should be not empty")
    private String name;

}
