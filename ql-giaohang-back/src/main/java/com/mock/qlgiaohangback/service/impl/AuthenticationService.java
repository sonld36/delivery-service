package com.mock.qlgiaohangback.service.impl;

import com.mock.qlgiaohangback.auth.JwtTokenUtil;
import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.dto.user.AccountLoginDTO;
import com.mock.qlgiaohangback.dto.user.AccountRegisterDTO;
import com.mock.qlgiaohangback.dto.user.AccountRespDTO;
import com.mock.qlgiaohangback.entity.AccountEntity;
import com.mock.qlgiaohangback.entity.CarrierEntity;
import com.mock.qlgiaohangback.entity.RoleEntity;
import com.mock.qlgiaohangback.exception.ResponseException;
import com.mock.qlgiaohangback.mapper.IAccountMapper;
import com.mock.qlgiaohangback.repository.AccountRepository;
import com.mock.qlgiaohangback.repository.CarrierRepository;
import com.mock.qlgiaohangback.service.IAccountService;
import com.mock.qlgiaohangback.service.IAuthenticationService;
import com.mock.qlgiaohangback.service.ICarrierService;
import com.mock.qlgiaohangback.service.IRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AuthenticationService implements IAuthenticationService {

    private final AccountRepository accountRepository;
    private final IAccountService userService;

    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;

    private final IRoleService roleService;
    private final CarrierRepository carrierRepository;

    @Override
    public Map<String, Object> login(AccountLoginDTO userLogin) {
        boolean checkExisted = accountRepository.existsByUsername(userLogin.getUsername());

        if (!checkExisted) {
            throw new ResponseException(MessageResponse.USER_NOT_EXISTED, HttpStatus.UNAUTHORIZED, Constans.Code.USER_NOT_EXISTED.getCode());
        }

        UserDetails userDetails = this.userService.loadUserByUsername(userLogin.getUsername());

        boolean checkMatch = this.comparePassword(userDetails.getPassword(), userLogin.getPassword());

        if (!checkMatch) {
            throw new ResponseException(MessageResponse.PASSWORD_NOT_MATCHES,
                    HttpStatus.BAD_REQUEST,
                    Constans.Code.PASSWORD_NOT_MATCHES.getCode());
        }

        SecurityContextHolder.getContext()
                .setAuthentication(new UsernamePasswordAuthenticationToken(userDetails.getUsername()
                        , userDetails.getAuthorities()));

        String jwt = this.jwtTokenUtil.generateToken(userDetails);
        Map<String, Object> infoUser = new HashMap<>();
        infoUser.put("token", jwt);
        infoUser.put("user", IAccountMapper.INSTANCE
                .toResponseDTO(this.userService.getAccountByUsername(userLogin.getUsername())));
        return infoUser;
    }

    @Override
    public AccountRespDTO register(AccountRegisterDTO registerDTO) {
        AccountEntity existed = this.userService.getAccountByUsername(registerDTO.getUsername());
        if (existed != null) {
            throw new ResponseException(MessageResponse.EXISTED,
                    HttpStatus.BAD_REQUEST,
                    Constans.Code.EXISTED.getCode());
        }

        AccountEntity user = IAccountMapper.INSTANCE.toRegisterEntity(registerDTO);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        RoleEntity role = this.roleService.getByName(Constans.Roles.ROLE_USER.name());

        user.setRole(role);

        return IAccountMapper.INSTANCE.toResponseDTO(this.userService.saveAccount(user));
    }

    public boolean comparePassword(String cPassword, String pPassword) {
        return passwordEncoder.matches(pPassword, cPassword);
    }

    @Override
    public AccountRespDTO createAcc(AccountRegisterDTO registerDTO, String roleParam) {
        AccountEntity existed = this.userService.getAccountByUsername(registerDTO.getUsername());
        if (existed != null) {
            throw new ResponseException(MessageResponse.EXISTED,
                    HttpStatus.BAD_REQUEST,
                    Constans.Code.EMAIL_EXISTED.getCode());
        }

        AccountEntity user = new AccountEntity();
        user.setUsername(registerDTO.getUsername());
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user.setName(registerDTO.getName());
        user.setPhoneNumber(registerDTO.getPhoneNumber());
        RoleEntity role = this.roleService.getByName(roleParam);
        AccountEntity account = this.userService.saveAccount(user);
        user.setRole(role);
        if (Objects.equals(role.getName(), Constans.Roles.ROLE_CARRIER.name())) {
            CarrierEntity carrier = new CarrierEntity();
            carrier.setAvailable(true);
            carrier.setName(registerDTO.getName());
            carrier.setPhoneNumber(registerDTO.getPhoneNumber());
            carrier.setAccount(account);
            carrier.setNumberAcceptOrder(0);
            carrier.setNumberRejectOrder(0);
            this.carrierRepository.save(carrier);
        }
        return IAccountMapper.INSTANCE.toResponseDTO(account);
    }
}
