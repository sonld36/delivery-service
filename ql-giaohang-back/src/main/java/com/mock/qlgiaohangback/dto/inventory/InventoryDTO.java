package com.mock.qlgiaohangback.dto.inventory;

import lombok.Builder;
import lombok.Data;

import javax.persistence.Column;

@Data
@Builder
public class InventoryDTO {
    private Long id;

    private String name;
    private String address;

    private Double longtitude;

    private Double latitude;

    private boolean active;
}
