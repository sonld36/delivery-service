package com.example.shippingapp.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateLocationDTO implements Serializable {
    private long userId;
    private double latitude;

    private double longitude;
}
