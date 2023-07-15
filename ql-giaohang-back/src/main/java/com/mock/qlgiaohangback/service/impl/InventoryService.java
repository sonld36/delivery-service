package com.mock.qlgiaohangback.service.impl;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.dto.inventory.InventoryDTO;
import com.mock.qlgiaohangback.entity.InventoryEntity;
import com.mock.qlgiaohangback.exception.ResponseException;
import com.mock.qlgiaohangback.repository.InventoryRepository;
import com.mock.qlgiaohangback.service.IInventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService implements IInventoryService {

    private final InventoryRepository inventoryRepository;


    @Override
    public List<InventoryEntity> getAll() {
        return inventoryRepository.findAllByActiveTrue().orElseThrow(() -> {throw new ResponseException(MessageResponse.NOT_FOUND, HttpStatus.BAD_REQUEST, Constans.Code.INVALID.getCode());
        });
    }

    @Override
    public InventoryEntity create(InventoryDTO inventoryDTO) {
        InventoryEntity inventory = new InventoryEntity();
        inventory.setName(inventoryDTO.getName());
        inventory.setAddress(inventoryDTO.getAddress());
        inventory.setLatitude(inventoryDTO.getLatitude());
        inventory.setLongtitude(inventoryDTO.getLongtitude());
        return this.inventoryRepository.save(inventory);
    }
}
