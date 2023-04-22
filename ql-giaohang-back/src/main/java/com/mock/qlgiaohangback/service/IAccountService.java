package com.mock.qlgiaohangback.service;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.dto.user.AccountRespDTO;
import com.mock.qlgiaohangback.dto.user.AccountUpdateDTO;
import com.mock.qlgiaohangback.dto.user.DeliveryRespDTO;
import com.mock.qlgiaohangback.entity.AccountEntity;
import org.springframework.data.domain.Page;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.io.IOException;
import java.util.List;

public interface IAccountService extends UserDetailsService {
    AccountEntity getAccountByUsername(String username);

    AccountEntity saveAccount(AccountEntity account);

    AccountEntity getAccountById(Long id);

    AccountRespDTO getAccountInfo();

    AccountRespDTO updateAccountInfo(AccountUpdateDTO accountUpdateDTO) throws IOException;

    AccountRespDTO getAccById(Long id);

    List<DeliveryRespDTO> getInfDeliverier();

    List<AccountRespDTO> getAll();

    AccountEntity getCurrentAccount();

    Page<AccountEntity> getAccountsByRole(Constans.Roles role, Integer page);
}
