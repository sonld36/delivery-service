package com.mock.qlgiaohangback.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "addresses")
@RequiredArgsConstructor
@Data
@EntityListeners(AuditingEntityListener.class)
@Embeddable
public class AddressEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "address_detail")
    private String addressDetail;

    @Column(name = "province_code")
    private Integer provinceCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    @ToString.Exclude
    @JsonBackReference
    private CustomerEntity customer;

    @OneToMany(mappedBy = "address")
    private List<OrderEntity> orders;

    @ManyToOne
    @JoinColumn(name = "shop_id", referencedColumnName = "id")
    @ToString.Exclude
    private ShopEntity shop;

    @Column(name = "district_code")
    private Integer districtCode;

    @Column(name = "ward_code")
    private Integer wardCode;

    @Column(columnDefinition = "boolean default 1")
    private boolean active;

    @CreatedDate
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date createAt;

    @Column(name = "modified_at")
    @Temporal(TemporalType.TIMESTAMP)
    @LastModifiedDate
    private Date modifiedAt;

}
