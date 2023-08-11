package com.mock.qlgiaohangback.entity;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "carriers")
@RequiredArgsConstructor
@Data
public class CarrierEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", referencedColumnName = "id")
    private AccountEntity account;


    @OneToMany(mappedBy = "carrier", fetch = FetchType.LAZY)
    private List<OrderEntity> orders;

    @Column
    private String name;

    @Column(name = "longitude_newest")
    private Double longitudeNewest;

    @Column(name = "latitude_newest")
    private Double latitudeNewest;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "is_active")
    private boolean isActive;

    @Column(name = "available")
    private boolean available;

    @Column(name = "path_avatar")
    private String pathAvatar;

    @Column(name = "number_accept_order")
    private Integer numberAcceptOrder;

    @Column(name = "number_reject_order")
    private Integer numberRejectOrder;

    @Column(name = "distance_in_km")
    private transient Double distance;

}
