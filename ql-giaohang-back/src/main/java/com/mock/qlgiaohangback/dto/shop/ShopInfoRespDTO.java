package com.mock.qlgiaohangback.dto.shop;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.dto.address.AddressDTO;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import javax.persistence.Column;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@RequiredArgsConstructor
@Data
public class ShopInfoRespDTO implements Serializable {

    private String email;

    private String username;

    private Long id;

    private String name;
    private String phoneNumber;

    private Constans.ShopStatus status;

    private List<AddressDTO> addresses;


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

    private Double longitude;

    private Double latitude;


    private Date joinedAt;

    private Date modifiedAt;
}
