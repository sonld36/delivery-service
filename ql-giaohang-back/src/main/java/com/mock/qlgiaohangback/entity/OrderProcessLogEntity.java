package com.mock.qlgiaohangback.entity;


import com.mock.qlgiaohangback.common.Constans;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "order_process_logs")
@Data
@RequiredArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class OrderProcessLogEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "owner_order")
    private ShopEntity owner;

    @ManyToOne
    @JoinColumn(name = "account_modified_id")
    private AccountEntity account;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private OrderEntity order;

    private Constans.OrderLogAction action;

    @Column(name = "to_status")
    private Constans.OrderStatus toStatus;

    @Temporal(TemporalType.TIMESTAMP)
    @CreatedDate
    @Column(name = "created_at")
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @LastModifiedDate
    @Column(name = "modified_at")
    private Date modifiedAt;

}
