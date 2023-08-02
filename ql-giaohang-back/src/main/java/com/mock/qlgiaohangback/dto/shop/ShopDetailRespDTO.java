package com.mock.qlgiaohangback.dto.shop;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.dto.address.AddressDTO;
import com.mock.qlgiaohangback.dto.customer.CustomerRespDTO;
import com.mock.qlgiaohangback.dto.product.ProductRespDTO;
import com.mock.qlgiaohangback.dto.user.AccountRespDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Builder
@AllArgsConstructor
@Data
public class ShopDetailRespDTO {
    private String email;

    private Long id;

    private Constans.ShopStatus status;
    private AccountRespDTO account;
    private List<AddressDTO> addresses;
    private List<ProductRespDTO> products;

    private List<CustomerRespDTO> customers;

    private Double latitude;
    private Double longitude;
}
