package com.mock.qlgiaohangback.dto.shipper;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ShipperResponseDTO {
    private Long accountId;
    private String name;
    private String phoneNumber;
    private Integer totalOfOrder;
    private Integer beingTransported;
    private Integer pendingAccept;
}
