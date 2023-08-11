package com.mock.qlgiaohangback.dto.carrier;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class CarrierToRecommendDTO {
    private Long id;

    private Long accountId;

    private String name;

    private Double longitudeNewest;

    private Double latitudeNewest;

    private String phoneNumber;

    private boolean isActive;

    private boolean available;

    private String pathAvatar;
    private double countNumberOnTime;

    private int numberAcceptOrder;
    private int numberRejectOrder;
    private double numberOrderCompleted;
    private double orderAcceptRating;

    private double weightAverage;
    private double distance;
}
