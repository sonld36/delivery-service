package com.mock.qlgiaohangback.entity;

import com.mock.qlgiaohangback.common.Constans;
import lombok.*;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "shops")
@Getter
@Setter
@Data
@RequiredArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class ShopEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String email;

    @Enumerated(EnumType.STRING)
    private Constans.ShopStatus status;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", referencedColumnName = "id")
    @ToString.Exclude
    private AccountEntity account;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "shop", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<ProductEntity> products;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "shop", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<CustomerEntity> customers;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "shop", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<OrderEntity> orders;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "shop", cascade = CascadeType.ALL)
    private List<AddressEntity> addresses;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "joined_at")
    private Date joinedAt;

    @LastModifiedDate
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "modified_at")
    private Date modifiedAt;
}
