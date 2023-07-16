package com.example.shippingapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CarrierRespDTO {
    private Long id;

    private Long accountId;

    private String name;

    private Double longitudeNewest;

    private Double latitudeNewest;

    private String phoneNumber;

    private boolean active;

    private boolean available;

    private String pathAvatar;
}
