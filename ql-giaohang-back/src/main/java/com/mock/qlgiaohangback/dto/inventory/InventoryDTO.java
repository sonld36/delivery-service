package com.mock.qlgiaohangback.dto.inventory;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InventoryDTO {
    private Long id;

    private String name;
    private String address;

    private boolean active;
}
