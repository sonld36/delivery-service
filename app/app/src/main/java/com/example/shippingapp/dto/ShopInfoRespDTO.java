package com.example.shippingapp.dto;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class ShopInfoRespDTO implements Serializable {
    private String email;

    private String username;

    private Long id;

    private String name;

    private String status;

    private String phoneNumber;

    private List<AddressDTO> addresses;

    private Double longitude;

    private Double latitude;


    private Date joinedAt;

    private Date modifiedAt;
}
