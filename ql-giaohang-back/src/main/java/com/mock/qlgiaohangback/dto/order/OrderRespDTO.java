package com.mock.qlgiaohangback.dto.order;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.dto.address.AddressDTO;
import com.mock.qlgiaohangback.dto.customer.CustomerRespDTO;
import com.mock.qlgiaohangback.dto.order_product.OrderProductRespDTO;
import com.mock.qlgiaohangback.dto.shop.ShopInfoRespDTO;
import com.mock.qlgiaohangback.dto.user.AccountRespDTO;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@RequiredArgsConstructor
public class OrderRespDTO {
    private Long id;

    private Constans.TypeOfDelivery type;

    private Constans.OrderStatus status;

    private Double shipFee;

    private Double paymentTotal;

    private String note;

    private List<OrderProductRespDTO> products;

    private AddressDTO address;

    private ShopInfoRespDTO shop;

    private AccountRespDTO carrier;


    private CustomerRespDTO customer;

    private Date createdAt;

    private Date modifiedAt;

    private Date completedAt;

    private Date timeReceiveExpected;

    private Boolean isPaid;
}
