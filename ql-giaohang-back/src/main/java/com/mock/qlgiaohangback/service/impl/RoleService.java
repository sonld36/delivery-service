package com.mock.qlgiaohangback.service.impl;

import com.mock.qlgiaohangback.entity.RoleEntity;
import com.mock.qlgiaohangback.repository.RoleRepository;
import com.mock.qlgiaohangback.service.IRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleService implements IRoleService {

    private final RoleRepository roleRepo;

    @Override
    public RoleEntity getByName(String name) {
        return this.roleRepo.findByName(name).get();
    }
}
