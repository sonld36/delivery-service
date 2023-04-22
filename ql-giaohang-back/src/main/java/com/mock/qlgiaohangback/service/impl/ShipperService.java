package com.mock.qlgiaohangback.service.impl;


import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.dto.shipper.ShipperResponseDTO;
import com.mock.qlgiaohangback.dto.shipper.ShipperResponsePaging;
import com.mock.qlgiaohangback.entity.AccountEntity;
import com.mock.qlgiaohangback.service.IAccountService;
import com.mock.qlgiaohangback.service.IOrderService;
import com.mock.qlgiaohangback.service.IShipperService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShipperService implements IShipperService {
    Logger log = LoggerFactory.getLogger(ShipperService.class);
    private final IAccountService accountService;
    private final IOrderService orderService;


    @Override
    public ShipperResponsePaging<List<ShipperResponseDTO>> getShipper(Integer page) {
        Page<AccountEntity> accounts = this.accountService
                .getAccountsByRole(Constans.Roles.ROLE_CARRIER, page);
        List<ShipperResponseDTO> shipperResponseDTO = accounts.getContent().stream().map((item) -> {
            Integer countAllOrder = this.orderService.getAllByShipperId(item.getId()).size();
            Integer countOrderDelivering = this.orderService.countByCarrierAndStatus(item, Constans.OrderStatus.BEING_TRANSPORTED);
            Integer countOrderPending = this.orderService.countByCarrierAndStatus(item, Constans.OrderStatus.WAITING_FOR_ACCEPT_NEW_ORDER);
            return ShipperResponseDTO.builder().totalOfOrder(countAllOrder).accountId(item.getId()).beingTransported(countOrderDelivering).pendingAccept(countOrderPending).phoneNumber(item.getPhoneNumber()).name(item.getName()).build();
        }).collect(Collectors.toList());

        return ShipperResponsePaging.<List<ShipperResponseDTO>>builder().totalPage(accounts.getTotalPages()).data(shipperResponseDTO).build();

    }
}
