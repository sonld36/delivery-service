package com.mock.qlgiaohangback.entity;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@RequiredArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class ProductEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column(name = "product_code")
    private String productCode;

    @Column(name = "sale_price")
    private Integer salePrice;

    @Column(name = "entry_price")
    private Integer entryPrice;

    @Column
    private Double weight;

    @Column
    private Boolean active;

    @Column(name = "path_image")
    private String pathImage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id")
    private ShopEntity shop;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<OrderProductEntity> orderProductEntities;

    @Temporal(TemporalType.TIMESTAMP)
    @CreatedDate
    @Column(name = "created_at")
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @LastModifiedDate
    @Column(name = "modified_at")
    private Date modifiedAt;
}
