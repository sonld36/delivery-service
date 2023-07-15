package com.mock.qlgiaohangback.dto.carrier;

import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@Builder
public class CarrierCreateDTO {
    private String name;
    private String phoneNumber;
}
