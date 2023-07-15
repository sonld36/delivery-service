package com.example.shippingapp.dto;

import java.util.List;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class ResponseWithPagingDTO<T> {
    private int totalPage;
    private T paging;
}
