package com.mock.qlgiaohangback.service.impl;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.dto.user.AccountRespDTO;
import com.mock.qlgiaohangback.dto.user.AccountUpdateDTO;
import com.mock.qlgiaohangback.dto.user.DeliveryRespDTO;
import com.mock.qlgiaohangback.entity.AccountEntity;
import com.mock.qlgiaohangback.exception.ResponseException;
import com.mock.qlgiaohangback.helpers.FileHelpers;
import com.mock.qlgiaohangback.helpers.ObjectHelpers;
import com.mock.qlgiaohangback.mapper.IAccountMapper;
import com.mock.qlgiaohangback.mapper.IShopMapper;
import com.mock.qlgiaohangback.repository.AccountRepository;
import com.mock.qlgiaohangback.service.IAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService implements IAccountService {

    private final AccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AccountEntity account = getAccountByUsername(username);
        if (account == null) {
            throw new UsernameNotFoundException("Username " + username + " was not found in system");
        }

        List<String> rolesName = Collections.singletonList(account.getRole().getName());

        List<GrantedAuthority> grantedList = new ArrayList<>();

        if (!rolesName.isEmpty()) {
            rolesName.forEach((item) -> {
                GrantedAuthority granted = new SimpleGrantedAuthority(item);
                grantedList.add(granted);
            });
        }

        return new User(account.getUsername(), account.getPassword(), grantedList);
    }

    @Override
    public AccountEntity getAccountByUsername(String username) {
        return this.accountRepository.findByUsername(username);
    }

    @Override
    public AccountEntity saveAccount(AccountEntity account) {
        return this.accountRepository.save(account);
    }

    @Override
    public AccountEntity getAccountById(Long id) {
        return this.accountRepository.findById(id).orElseThrow(() -> {
            throw new ResponseException(MessageResponse.NOT_EXISTED,
                    HttpStatus.BAD_REQUEST, Constans.Code.ACCOUNT_NOT_EXISTED.getCode());
        });
    }

    @Override
    public AccountRespDTO getAccountInfo() {
        Authentication user = SecurityContextHolder.getContext().getAuthentication();
        String username = user.getName();
        return IAccountMapper.INSTANCE.toResponseDTO(this.accountRepository.findByUsername(username));
    }

    @Override
    public AccountRespDTO updateAccountInfo(AccountUpdateDTO accountUpdateDTO) throws IOException {
        AccountEntity accountEntity = this.getAccountById(accountUpdateDTO.getId());

        /**
         * lưu ảnh sản phẩm vào server và trả về đường dẫn của ảnh đấy
         * */

        String imagePath = FileHelpers.saveImage(accountUpdateDTO.getImage(), "avatar");
        System.out.println("imagePath: " + imagePath);
        AccountEntity account = IAccountMapper.INSTANCE.toEntity(accountUpdateDTO);
        account.setPathAvatar(imagePath);

        ObjectHelpers.copyNonNullProperties(accountEntity, account);
        /**
         * Thêm đường dẫn ảnh để lưu vào db
         * */
        accountEntity.setPathAvatar(imagePath);

        return IAccountMapper.INSTANCE.toResponseDTO(this.accountRepository.save(accountEntity));
    }

    @Override
    public AccountRespDTO getAccById(Long id) {
        return IAccountMapper.INSTANCE.toResponseDTO(this.accountRepository.findAccById(id));
    }

    @Override

    public List<DeliveryRespDTO> getInfDeliverier() {
        List<AccountEntity> listDeliverier = this.accountRepository.findAllDeliverier();
        List<DeliveryRespDTO> listDeliverierDTO = new ArrayList<>();
        for (AccountEntity l : listDeliverier) {
            DeliveryRespDTO dto = new DeliveryRespDTO();
            dto.setDeliveryName(l.getName());
            dto.setDeliveryPhone(l.getPhoneNumber());
            dto.setDeliveryId(l.getId().toString());
            listDeliverierDTO.add(dto);
        }
        return listDeliverierDTO;
    }

        @Override
    public List<AccountRespDTO> getAll() {
        return this.accountRepository.findAll().stream().map(IAccountMapper.INSTANCE::toResponseDTO).collect(Collectors.toList());

    }


}
