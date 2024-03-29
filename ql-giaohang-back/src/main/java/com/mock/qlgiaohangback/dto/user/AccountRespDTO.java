package com.mock.qlgiaohangback.dto.user;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import javax.validation.constraints.NotEmpty;
import java.util.Date;

@Data
@RequiredArgsConstructor
public class AccountRespDTO {

    @NotEmpty
    private Long id;

    private String username;

    private String name;

    private Date createdAt;

    @NotEmpty
    private String role;
}
