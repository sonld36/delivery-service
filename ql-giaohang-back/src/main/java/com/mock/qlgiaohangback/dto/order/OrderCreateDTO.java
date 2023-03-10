package com.mock.qlgiaohangback.dto.order;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.dto.address.AddressDTO;
import com.mock.qlgiaohangback.dto.customer.CustomerRespDTO;
import com.mock.qlgiaohangback.dto.product.ProductInOrderCreateDTO;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

@Data
@RequiredArgsConstructor
public class OrderCreateDTO {


    private Constans.TypeOfDelivery type;
    private String note;

    @NotNull
    private Double shipFee;

    @NotNull
    private Date timeReceiveExpected;

    private Double paymentTotal;

    @NotNull
    private CustomerRespDTO customer;

    @NotNull
    private AddressDTO address;

    @NotEmpty
    private List<ProductInOrderCreateDTO> products;

}
