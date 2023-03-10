package com.mock.qlgiaohangback.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.mock.qlgiaohangback.helpers.db.OrderProductId;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Data
@RequiredArgsConstructor
@Table(name = "orders_products")
//@AssociationOverrides({
//        @AssociationOverride(name = "orderProductId.order",
//        joinColumns = @JoinColumn(name = "id")),
//        @AssociationOverride(name = "orderProductId.product",
//        joinColumns = @JoinColumn(name = "id"))
//})
public class OrderProductEntity {
    @EmbeddedId
    private OrderProductId orderProductId = new OrderProductId();

    @ManyToOne
    @MapsId("orderId")
    @JsonBackReference
    @ToString.Exclude
    private OrderEntity order;

    @ManyToOne()
    @MapsId("productId")
    @ToString.Exclude
    private ProductEntity product;

    @Column(name = "product_quantity")
    private Integer productQuantity;

    @Column(name = "product_price")
    private Integer productPrice;

}
