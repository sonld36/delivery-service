package com.mock.qlgiaohangback.exception;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.common.ResponseHandler;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.naming.AuthenticationException;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class HandleExceptions extends ResponseEntityExceptionHandler {
    @ExceptionHandler(value = ResponseException.class)
    public ResponseEntity<Object> response(ResponseException exception) {
        return ResponseHandler.generateResponse(exception.getMessage(), exception.getCode(), exception.getHttpStatus(), null);
    }

    @ExceptionHandler(value = AuthenticationException.class)
    public ResponseEntity<Object> responseAuth(Exception ex) {
        return ResponseHandler.generateResponse(ex.getMessage(), 4011L, HttpStatus.UNAUTHORIZED, null);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach((error) -> {

            String fieldName = ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            errors.put(fieldName, message);
        });

        return ResponseHandler.generateResponse(MessageResponse.VALUE_PASSED_INCORRECT, Constans.Code.INVALID.getCode(), HttpStatus.BAD_REQUEST, errors);
    }
}
