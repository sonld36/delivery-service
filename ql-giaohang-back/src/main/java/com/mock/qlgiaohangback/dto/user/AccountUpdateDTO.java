package com.mock.qlgiaohangback.dto.user;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@RequiredArgsConstructor
public class AccountUpdateDTO {

    //    @NotEmpty
    private Long id;

    //    @NotEmpty(message = "Product should be have phoneNumber")
    private String phoneNumber;

    //    @NotEmpty(message = "Product should be have name")
    private String name;

    private MultipartFile image;
}
