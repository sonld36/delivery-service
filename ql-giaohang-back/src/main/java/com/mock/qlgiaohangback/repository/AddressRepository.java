package com.mock.qlgiaohangback.repository;

import com.mock.qlgiaohangback.entity.AddressEntity;
import com.mock.qlgiaohangback.entity.ShopEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<AddressEntity, Long> {
    @Override
    <S extends AddressEntity> List<S> saveAll(Iterable<S> entities);

    AddressEntity getByShopAndActiveIsTrue(ShopEntity shop);

    Optional<Integer> deleteByIdAndCustomerId(Long id, Long customerId);
}
