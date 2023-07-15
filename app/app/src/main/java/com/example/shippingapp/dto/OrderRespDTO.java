package com.example.shippingapp.dto;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderRespDTO implements Serializable {
    private Long id;

    private String type;

    private String status;

    private Double shipFee;

    private Double paymentTotal;

    private String note;

    private List<OrderProductRespDTO> products;

    private ShopInfoRespDTO shop;

    private AccountRespDTO carrier;

    private String fromAddress;
    private String destinationAddress;
    private Double destinationLongitude;
    private Double destinationLat;


    private CustomerRespDTO customer;

    private Date createdAt;

    private Date modifiedAt;

    private Date completedAt;

    private Date timeReceiveExpected;

    private Boolean isPaid;
}
