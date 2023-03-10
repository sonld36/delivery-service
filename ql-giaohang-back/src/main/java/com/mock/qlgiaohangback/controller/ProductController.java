package com.mock.qlgiaohangback.controller;


import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.common.ResponseHandler;
import com.mock.qlgiaohangback.dto.product.ProductCreateDTO;
import com.mock.qlgiaohangback.dto.product.ProductUpdateDTO;
import com.mock.qlgiaohangback.service.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.IOException;

@RequiredArgsConstructor
@RestController
@RequestMapping("/product")
public class ProductController {
    private final IProductService productService;

    @PostMapping
    public ResponseEntity createProduct(
            @ModelAttribute @Valid ProductCreateDTO productCreateDTO
    ) throws IOException {

//        Path path = Paths.get(ClassLoader.getSystemResource("/").getPath());
//        System.out.println(path);
        return ResponseHandler.generateResponse(MessageResponse.CREATED_SUCCESS,
                Constans.Code.CREATED_SUCCESS.getCode(),
                HttpStatus.OK,
                this.productService
                        .createProduct(productCreateDTO)
        );
    }


    @GetMapping
    public ResponseEntity getProduct(
            @RequestParam("page") Integer page
    ) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.productService.getProducts(page)
        );
    }

    @GetMapping("/search")
    public ResponseEntity searchProduct(
            @RequestParam("name") String name
    ) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.productService.searchProductByName(name));
    }

    @PutMapping
    public ResponseEntity updateProduct(
            @ModelAttribute @Valid ProductUpdateDTO productUpdateDTO
    ) throws IOException {
        return ResponseHandler.generateResponse(MessageResponse.CREATED_SUCCESS,
                Constans.Code.UPDATE_SUCCESSFUL.getCode(),
                HttpStatus.OK,
                this.productService.update(productUpdateDTO)
        );
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity deleteProduct(@PathVariable("id") Long id) {
//        System.out.println(id);
//        return  null;
        return ResponseHandler.generateResponse(MessageResponse.DELETE_SUCCESS,
                Constans.Code.DELETE_SUCCESSFUL.getCode(),
                HttpStatus.OK,
                this.productService.deleteProduct(id));
    }

    @GetMapping(params = {"startDate", "endDate"})
    public ResponseEntity getTop10ProductInRangeDate(@RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate) {
        return ResponseHandler.generateResponse(MessageResponse.FOUND,
                Constans.Code.OK.getCode(),
                HttpStatus.OK,
                this.productService.getTop10ProductInDateRange(startDate, endDate));
    }


}
