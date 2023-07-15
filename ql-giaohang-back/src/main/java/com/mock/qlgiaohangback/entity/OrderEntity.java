package com.mock.qlgiaohangback.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.mock.qlgiaohangback.common.Constans;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "_orders")
@Data
@RequiredArgsConstructor
@EntityListeners({AuditingEntityListener.class})
public class OrderEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    @Enumerated(EnumType.STRING)
    private Constans.TypeOfDelivery type;

    @Column
    @Enumerated(EnumType.STRING)
    private Constans.OrderStatus status;

    @Column(name = "ship_fee")
    private Double shipFee;

    @Column(name = "payment_total")
    private Double paymentTotal;

    @Column
    private String note;

    @Column
    private Boolean isPaid;

    @OneToMany(mappedBy = "order", cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    @JsonManagedReference
    @JsonIgnore
    @ToString.Exclude
    private List<OrderProductEntity> orderProductEntities;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", referencedColumnName = "id")
    private ShopEntity shop;

    @Column(name = "from_address")
    private String fromAddress;

    @Column(name = "des_address")
    private String destinationAddress;

    @Column(name = "des_long")
    private Double destinationLongitude;
    @Column(name = "des_lat")
    private Double destinationLat;

    @ManyToOne(fetch = FetchType.LAZY)
    @ToString.Exclude
    @JoinColumn(name = "COD_id", referencedColumnName = "id")
    private CODEntity cod;

    @ManyToOne(fetch = FetchType.LAZY)
    @ToString.Exclude
    @JoinColumn(name = "carrier_id", referencedColumnName = "id")
    private CarrierEntity carrier;

    @ManyToOne(fetch = FetchType.LAZY)
    @ToString.Exclude
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    @JsonIgnore
    private CustomerEntity customer;

    @Column(name = "address_customer")
    @JsonIgnore
    private String address;

    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
    @ToString.Exclude
    @JsonIgnore
    private List<OrderProcessLogEntity> orderProcessLogEntity;

    @CreatedDate
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date createdAt;

    @LastModifiedDate
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "modified_at")
    private Date modifiedAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "completed_at")
    private Date completedAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "time_receive_expected")
    private Date timeReceiveExpected;
}
