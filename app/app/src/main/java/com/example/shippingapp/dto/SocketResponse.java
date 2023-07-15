package com.example.shippingapp.dto;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class SocketResponse<T>{
    private String message;
    private T data;
}
