package com.example.shippingapp.dto;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Data
public class MessageDTO <T>{
    private T data;
    private String message;
}
