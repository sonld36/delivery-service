package com.mock.qlgiaohangback.repository;

import com.mock.qlgiaohangback.entity.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<AccountEntity, Long> {
    AccountEntity findByUsername(String username);

    boolean existsByUsername(String username);

    AccountEntity save(AccountEntity entity);


    Optional<AccountEntity> findById(Long id);

    @Query(value = "SELECT * FROM accounts acc WHERE acc.role_id LIKE :roleId", nativeQuery = true)
    List<AccountEntity> findByRole(Long roleId);

    @Query(value="SELECT * FROM accounts a WHERE a.id LIKE :id",nativeQuery = true)
    AccountEntity findAccById(@Param("id") Long id);

    @Query(value = "SELECT * FROM accounts acc WHERE acc.role_id=3", nativeQuery = true)
    List<AccountEntity> findAllDeliverier();

}
