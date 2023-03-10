package com.mock.qlgiaohangback.dto.shop;

import com.mock.qlgiaohangback.common.Constans;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.io.Serializable;
import java.util.Date;

@RequiredArgsConstructor
@Data
public class ShopInfoRespDTO implements Serializable {

    private String email;

    private String username;

    private Long id;

    private String name;

    private Constans.ShopStatus status;


//    @OneToMany(fetch = FetchType.LAZY, mappedBy = "shop", cascade = CascadeType.ALL)
//    private List<ProductEntity> products;
//
//    @OneToMany(fetch = FetchType.LAZY, mappedBy = "shop", cascade = CascadeType.ALL)
//    private List<ReceiverEntity> receivers;
//
//    @OneToMany(fetch = FetchType.LAZY, mappedBy = "shop", cascade = CascadeType.ALL)
//    private List<OrderEntity> orders;
//
//    @OneToMany(fetch = FetchType.LAZY, mappedBy = "shop")
//    private List<AddressEntity> addresses;


    private Date joinedAt;

    private Date modifiedAt;
}
