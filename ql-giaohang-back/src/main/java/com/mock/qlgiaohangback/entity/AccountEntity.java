package com.mock.qlgiaohangback.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "accounts")
@Getter
@Setter
@RequiredArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class AccountEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    @Column
    private String password;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", referencedColumnName = "id")
//    @JsonBackReference
    @JsonIgnore
    private RoleEntity role;

    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private ShopEntity shop;

    //    @OneToOne(mappedBy = "account")
//    private CarrierEntity carrier;
    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "path_avatar")
    private String pathAvatar;

    @OneToOne(mappedBy = "account", fetch = FetchType.LAZY)
    @JsonIgnore
    private CarrierEntity carrier;

    @Column
    private String name;


    @OneToMany(mappedBy = "carrier", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<OrderEntity> order;

    @OneToMany(mappedBy = "account", fetch = FetchType.LAZY)
    private List<OrderProcessLogEntity> orderProcessLogEntities;

    @OneToMany(mappedBy = "destination", fetch = FetchType.LAZY)
    private List<NotificationEntity> notifyDestination;

    @OneToMany(mappedBy = "from", fetch = FetchType.LAZY)
    private List<NotificationEntity> notifyFrom;


    @CreatedDate
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date createdAt;

    @LastModifiedDate
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "modified_at")
    private Date modifiedAt;

    @Override
    public String toString() {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("id: ").append(id)
                .append("- username: ").append(username)
                .append("- password: ").append(password)
                .append("- phoneNumber: ").append(phoneNumber)
                .append("- createdAt: ").append(createdAt)
                .append("- modifiedAt: ").append(modifiedAt);

        return stringBuilder.toString();


    }
}
