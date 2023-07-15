package com.example.shippingapp.dto;

public class ResponseTemplateDTO<T> {
    private String message;
    private Number code;
    private T data;

    public ResponseTemplateDTO(String message, Number code, T data) {
        this.message = message;
        this.code = code;
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public Number getCode() {
        return code;
    }

    public T getData() {
        return data;
    }
}
