package com.mock.qlgiaohangback.service.impl;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.dto.PagingResp;
import com.mock.qlgiaohangback.dto.address.AddressDTO;
import com.mock.qlgiaohangback.dto.shop.ShopDetailRespDTO;
import com.mock.qlgiaohangback.dto.shop.ShopInfoForManager;
import com.mock.qlgiaohangback.dto.shop.ShopInfoRespDTO;
import com.mock.qlgiaohangback.dto.shop.ShopRegisterDTO;
import com.mock.qlgiaohangback.dto.user.AccountRespDTO;
import com.mock.qlgiaohangback.entity.AccountEntity;
import com.mock.qlgiaohangback.entity.OrderEntity;
import com.mock.qlgiaohangback.entity.RoleEntity;
import com.mock.qlgiaohangback.entity.ShopEntity;
import com.mock.qlgiaohangback.exception.ResponseException;
import com.mock.qlgiaohangback.mapper.IAccountMapper;
import com.mock.qlgiaohangback.mapper.IAddressMapper;
import com.mock.qlgiaohangback.mapper.IShopMapper;
import com.mock.qlgiaohangback.repository.ShopRepository;
import com.mock.qlgiaohangback.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShopService implements IShopService {

    private final ShopRepository shopRepository;
    private final IAuthenticationService authenticationService;

    private final IAccountService accountService;

    private final IAddressService addressService;
    private final IRoleService roleService;

    @Override
    public ShopInfoRespDTO register(ShopRegisterDTO shopRegisterDTO) {
        boolean existed = this.shopRepository.existsByEmail(shopRegisterDTO.getEmail());
        if (existed) {
            throw new ResponseException(MessageResponse.EXISTED,
                    HttpStatus.BAD_REQUEST,
                    Constans.Code.EMAIL_EXISTED.getCode());
        }
        AccountRespDTO accountComingSave = this.authenticationService
                .register(IAccountMapper.INSTANCE.shopRegisterToAccountRegister(shopRegisterDTO));
        AccountEntity account = this.accountService.getAccountById(accountComingSave.getId());
        RoleEntity roleEntity = roleService.getByName(Constans.Roles.ROLE_SHOP.name());
        account.setRole(roleEntity);
        ShopEntity comingSave = IShopMapper.INSTANCE.fromRegisterToEntity(shopRegisterDTO);
        comingSave.getAddresses().forEach(item -> {
            item.setShop(comingSave);
        });
        comingSave.setStatus(Constans.ShopStatus.ACCEPTED);
        comingSave.setAccount(account);
        return IShopMapper.INSTANCE.fromEntityToInfoRespDTO(this.shopRepository.save(comingSave));
//        return null;
    }

    public List<ShopEntity> findAll() {
        List<ShopEntity> listShop = this.shopRepository.findAll();
        return listShop;
    }


    @Override
    public ShopEntity getShopByAccountId(Long accountId) {
        return this.shopRepository.findByAccount_Id(accountId);
    }

    @Override
    public ShopEntity getShopLoggedIn() {
        return this.getShopByAccountId(this.accountService.getCurrentAccount().getId());
    }

    public List<ShopDetailRespDTO> getShopByStatus(Constans.ShopStatus status) {
        return this.shopRepository.findByStatus(status).stream().map(IShopMapper.INSTANCE::fromEntityToDetailRespDTO).collect(Collectors.toList());
    }

    public List<ShopDetailRespDTO> getAll(){
        return this.shopRepository.findAll().stream().map(IShopMapper.INSTANCE::fromEntityToDetailRespDTO).collect(Collectors.toList());
    }

    public ShopDetailRespDTO getShopById(Long id) {
        return IShopMapper.INSTANCE.fromEntityToDetailRespDTO(this.shopRepository.findShopById(id));
    }

    public ShopDetailRespDTO setShopStatus(Long id, Constans.ShopStatus status) {
        ShopEntity shopEntity = this.shopRepository.findShopById(id);
        shopEntity.setStatus(status);
        AccountEntity account = shopEntity.getAccount();
        RoleEntity roleShop = this.roleService.getByName(Constans.Roles.ROLE_SHOP.name());
        account.setRole(roleShop);
        shopEntity.setAccount(account);
        return IShopMapper.INSTANCE.fromEntityToDetailRespDTO(this.shopRepository.save(shopEntity));
    }

    @Override
    public AddressDTO getAddressForShop() {
        ShopEntity shop = getShopLoggedIn();
        if (shop.getAddresses().get(0) != null) {
            return IAddressMapper.INSTANCE.toDTO(shop.getAddresses().get(0));
        }
        return null;
    }

    @Override
    public PagingResp<ShopInfoForManager> getByPaging(int page) {
        Page<ShopEntity> shopEntityPage = this.shopRepository.getAllBy(PageRequest.of(page - 1, 10));
        List<ShopInfoForManager> shops = shopEntityPage.getContent().stream().map(item -> {
           String phoneNumber = item.getAccount().getPhoneNumber();
           String username = item.getAccount().getUsername();
           List<OrderEntity> orders = item.getOrders();
           double totalCashPaid = orders.stream().filter(i -> i.getStatus().equals(Constans.OrderStatus.DONE)).reduce(0.0, (sub, e) -> sub + e.getPaymentTotal(), Double::sum);
           double totalCashToRefund = orders.stream().filter(i -> i.getStatus().equals(Constans.OrderStatus.DELIVERY_SUCCESSFUL)).reduce(0.0, (sub, e) -> sub + e.getPaymentTotal(), Double::sum);

           return ShopInfoForManager.builder().email(item.getEmail()).phoneNumber(phoneNumber).username(username).totalCashPaid(totalCashPaid).totalCashToRefund(totalCashToRefund).id(item.getId()).build();
        }).collect(Collectors.toList());
        return PagingResp.<ShopInfoForManager>builder()
                .totalPage(shopEntityPage.getTotalElements())
                .listData(shops)
                .build();
    }
}

