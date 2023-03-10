package com.mock.qlgiaohangback.repository;

import com.mock.qlgiaohangback.entity.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<RoleEntity, String> {
    Optional<RoleEntity> findByName(String name);

    @Query("select distinct r.name from RoleEntity r")
    List<String> findDistinctByName();
}
