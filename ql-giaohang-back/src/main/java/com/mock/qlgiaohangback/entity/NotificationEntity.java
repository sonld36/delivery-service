package com.mock.qlgiaohangback.entity;

import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "notifications")
@Data
@RequiredArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class NotificationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "destination_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private AccountEntity destination;

    @JoinColumn(name = "from_id", nullable = true)
    @ManyToOne(fetch = FetchType.LAZY)
    private AccountEntity from;

    private Boolean seen;

    private String title;

    private String message;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    @CreatedDate
    private Date createdAt;


}
