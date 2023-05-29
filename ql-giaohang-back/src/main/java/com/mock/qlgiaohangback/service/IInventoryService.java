package com.mock.qlgiaohangback.service;

import com.mock.qlgiaohangback.dto.inventory.InventoryDTO;
import com.mock.qlgiaohangback.entity.InventoryEntity;

import java.util.List;

public interface IInventoryService {
    List<InventoryEntity> getAll();

    InventoryEntity create(InventoryDTO inventoryDTO);
}
