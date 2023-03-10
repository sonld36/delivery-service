package com.mock.qlgiaohangback.entity;

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
@Table(name = "cod")
@Data
@RequiredArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class CODEntity  implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String date;

    @Column(name = "shop_id")
    private Long shopId;

    @Column
    private Integer status;

    @OneToMany(mappedBy = "cod")
    private List<OrderEntity> orders;



    @CreatedDate
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date createdAt;
}
