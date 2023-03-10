package com.mock.qlgiaohangback.helpers.db;


public interface ICountProductQuantityWithStatus {
    Integer getTotalByStatus();

    String getStatus();

    Long getProductId();

    String getProductName();
}
