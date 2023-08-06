package com.mock.qlgiaohangback.repository;

import com.mock.qlgiaohangback.entity.AccountEntity;
import com.mock.qlgiaohangback.entity.NotificationEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
    Page<NotificationEntity> getByTitleOrderByCreatedAt(String title, Pageable page);

    Page<NotificationEntity> getNotificationEntitiesByDestinationOrderByCreatedAtDesc(AccountEntity account, Pageable page);

    int countNotificationEntitiesBySeenIsFalseAndDestination_Id(Long id);

    NotificationEntity getById(long id);
}
