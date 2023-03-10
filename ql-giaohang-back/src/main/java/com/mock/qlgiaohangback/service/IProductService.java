package com.mock.qlgiaohangback.service;

import com.mock.qlgiaohangback.dto.product.*;
import com.mock.qlgiaohangback.entity.ProductEntity;

import java.io.IOException;
import java.util.List;

public interface IProductService {
    ProductRespDTO createProduct(ProductCreateDTO productCreateDTO) throws IOException;

    ProductEntity getProductByName(String name);

    ProductRespWithPagingDTO getProducts(Integer page);

    ProductRespDTO update(ProductUpdateDTO productUpdateDTO) throws IOException;

    ProductEntity getProductById(Long id);

    Long deleteProduct(Long id);

    List<ProductRespDTO> searchProductByName(String name);

    List<ProductTop10DTO> getTop10ProductInDateRange(String startDate, String endDate);
}
