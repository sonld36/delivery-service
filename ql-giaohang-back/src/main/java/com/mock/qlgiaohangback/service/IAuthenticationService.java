package com.mock.qlgiaohangback.service;

import com.mock.qlgiaohangback.dto.user.AccountLoginDTO;
import com.mock.qlgiaohangback.dto.user.AccountRegisterDTO;
import com.mock.qlgiaohangback.dto.user.AccountRespDTO;

import java.util.Map;

public interface IAuthenticationService {
    Map<String, Object> login(AccountLoginDTO userLogin);

    AccountRespDTO register(AccountRegisterDTO accountRegister);

    AccountRespDTO createAcc(AccountRegisterDTO accountRegisterDTO, String role);
}
