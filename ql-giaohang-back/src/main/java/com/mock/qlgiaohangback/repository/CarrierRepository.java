package com.mock.qlgiaohangback.repository;

import com.mock.qlgiaohangback.dto.carrier.CarrierDistanceDTO;
import com.mock.qlgiaohangback.entity.CarrierEntity;
import com.mock.qlgiaohangback.repository.custom.CarrierRepoCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CarrierRepository extends JpaRepository<CarrierEntity, Long>, CarrierRepoCustom {
    Optional<CarrierEntity> findById(Long id);

    Page<CarrierEntity> findAll(Pageable page);

    List<CarrierEntity> findByIsActiveTrueAndAvailableTrue();

    Optional<CarrierEntity> findByAccount_Id(long accountId);

//    @Query(value = "CALL GetAllCarrierByLocation(:longitude, :latitude, :distance);", nativeQuery = true)
//    List<CarrierDistanceDTO> getByLocationAndDistance(@Param("longitude") double longitude, @Param("latitude") double latitude, @Param("distance") double distance);

}
