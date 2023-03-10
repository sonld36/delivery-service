package com.mock.qlgiaohangback.repository.custom;

import com.mock.qlgiaohangback.entity.OrderEntity;

import java.util.List;

public interface OrderRepoCustom {
    List<OrderEntity> getAllNotDoneYet(Long shopId);
}
