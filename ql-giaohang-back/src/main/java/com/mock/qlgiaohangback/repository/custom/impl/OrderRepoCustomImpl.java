package com.mock.qlgiaohangback.repository.custom.impl;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.entity.OrderEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.Arrays;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class OrderRepoCustomImpl implements com.mock.qlgiaohangback.repository.custom.OrderRepoCustom {

    private final EntityManager em;

    @Override
    public List<OrderEntity> getAllNotDoneYet(Long shopId) {
        TypedQuery<OrderEntity> query = em.createQuery("SELECT o FROM OrderEntity o WHERE o.status IN (?1) and o.shop.id = (?2)", OrderEntity.class);
        List<Constans.OrderStatus> processingStatus = Arrays.asList(Constans.OrderStatus.WAITING_FOR_ACCEPT_NEW_ORDER, Constans.OrderStatus.PICKING_UP_GOODS, Constans.OrderStatus.BEING_TRANSPORTED, Constans.OrderStatus.REQUEST_SHIPPING);
        return query.setParameter(1, processingStatus).setParameter(2, shopId).getResultList();
    }
}
