package com.mock.qlgiaohangback.dto.carrier;

import lombok.Builder;
import lombok.Data;

import java.math.BigInteger;

@Data
@Builder
public class CarrierDistanceDTO {
    private long id;
    private Double distance;
}
