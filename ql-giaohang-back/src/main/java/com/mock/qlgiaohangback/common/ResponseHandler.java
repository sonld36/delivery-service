package com.mock.qlgiaohangback.common;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ResponseHandler {
    public static ResponseEntity<Object> generateResponse(String message, Long code, HttpStatus status, Object responseObj) {
        Map<String, Object> map = new HashMap<>();
        map.put("message", message);
        map.put("code", code);
        map.put("data", responseObj);

        return new ResponseEntity<Object>(map, status);
    }

    public static Map<String, Object> generateForPaging(int totalPage, List<Object> data) {
        Map<String, Object> map = new HashMap<>();
        map.put("totalPage", totalPage);
        map.put("paging", data);

        return map;

    }
}
