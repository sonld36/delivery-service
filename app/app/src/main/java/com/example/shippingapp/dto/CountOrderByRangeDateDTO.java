package com.example.shippingapp.dto;

import java.util.Date;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CountOrderByRangeDateDTO {
    Integer countOrder;
    Date dateCreate;
    String status;
}