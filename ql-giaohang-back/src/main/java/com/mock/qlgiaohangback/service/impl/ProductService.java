package com.mock.qlgiaohangback.service.impl;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.dto.product.*;
import com.mock.qlgiaohangback.entity.ProductEntity;
import com.mock.qlgiaohangback.entity.ShopEntity;
import com.mock.qlgiaohangback.exception.ResponseException;
import com.mock.qlgiaohangback.helpers.FileHelpers;
import com.mock.qlgiaohangback.helpers.db.ICountProductQuantityWithStatus;
import com.mock.qlgiaohangback.mapper.IProductMapper;
import com.mock.qlgiaohangback.repository.ProductRepository;
import com.mock.qlgiaohangback.service.IProductService;
import com.mock.qlgiaohangback.service.IShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService implements IProductService {

    private final ProductRepository productRepository;

    private final IShopService shopService;

    @Override
    public ProductRespDTO createProduct(ProductCreateDTO productCreateDTO) throws IOException {
        ShopEntity shop = this.shopService.getShopLoggedIn();
//        System.out.println(productCreateDTO);
        List<ProductEntity> productExisted = this.productRepository.getByNameOrProductCode(productCreateDTO.getName(),
                productCreateDTO.getProductCode(),
                shop.getId());
        /**
         * Kiểm tra sản phẩm có tồn tại trong hệ thống hay chưa
         * */

        if (!productExisted.isEmpty()) {
            throw new ResponseException(MessageResponse.EXISTED, HttpStatus.BAD_REQUEST, Constans.Code.EXISTED.getCode());
        }

        /**
         * Kiểm tra giá nhập sản phẩm có nhỏ hơn giá bán ra hay không
         * */

        if (productCreateDTO.getEntryPrice() > productCreateDTO.getSalePrice()) {
            throw new ResponseException(MessageResponse.VALUE_PASSED_INCORRECT, HttpStatus.BAD_REQUEST, Constans.Code.INVALID.getCode());
        }


        /**
         * lưu ảnh sản phẩm vào server và trả về đường dẫn của ảnh đấy
         * */

        String imagePath = FileHelpers.saveImage(productCreateDTO.getImage(), "product");

        ProductEntity product = IProductMapper.INSTANCE.toEntity(productCreateDTO);
        /**
         * Thêm đường dẫn ảnh để lưu vào db
         * */
        product.setPathImage(imagePath);
        product.setShop(shop);

        return IProductMapper.INSTANCE.toDTO(this.productRepository.save(product));
    }

    @Override
    public ProductEntity getProductByName(String name) {
        return this.productRepository.findByName(name);
    }

    @Override
    public ProductRespWithPagingDTO getProducts(Integer page) {
        if (page < 1) {
            throw new ResponseException(MessageResponse.VALUE_PASSED_INCORRECT, HttpStatus.BAD_REQUEST, Constans.Code.INVALID.getCode());
        }

        ShopEntity shop = this.shopService.getShopLoggedIn();

        Page<ProductEntity> products = this.productRepository.findByShopIdOrderByCreatedAt(shop.getId(), PageRequest.of(page - 1,
                Integer.parseInt(Constans.CommonConstant.SIZE_PAGE.getSomeThing().toString())));

        List<ProductRespDTO> productsRespDTO = IProductMapper.INSTANCE.toDTOs(products.getContent());

        return ProductRespWithPagingDTO.builder().products(productsRespDTO).totalPage(products.getTotalPages()).build();
    }

    @Override
    public ProductRespDTO update(ProductUpdateDTO productUpdateDTO) throws IOException {
        ProductEntity productEntityExisted = getProductById(productUpdateDTO.getId());

        MultipartFile image = productUpdateDTO.getImage();
        ProductEntity productEntityToUpdate = IProductMapper.INSTANCE.toEntityUpdate(productUpdateDTO);
        if (!image.isEmpty()) {
            String imagePath = FileHelpers.saveImage(image, "product");
            productEntityToUpdate.setPathImage(imagePath);
        } else {
            productEntityToUpdate.setPathImage(productEntityExisted.getPathImage());
        }
        productEntityToUpdate.setShop(productEntityExisted.getShop());
        productEntityToUpdate.setCreatedAt(productEntityExisted.getCreatedAt());

        return IProductMapper.INSTANCE.toDTO(this.productRepository.save(this.productRepository.save(productEntityToUpdate)));
    }

    @Override
    public ProductEntity getProductById(Long id) {
        return this.productRepository.findById(id)
                .orElseThrow(() -> {
                    throw new ResponseException(MessageResponse.NOT_EXISTED,
                            HttpStatus.BAD_REQUEST, Constans.Code.NOT_EXITED.getCode());
                });
    }


    @Transactional
    @Override
    public Long deleteProduct(Long id) {
        this.getProductById(id);
        this.productRepository.deleteById(id);

        return id;
    }

    @Override
    public List<ProductRespDTO> searchProductByName(String name) {
        ShopEntity shop = shopService.getShopLoggedIn();

        List<ProductEntity> productEntities = this.productRepository.searchByNameContainsIgnoreCaseAndActiveTrueAndShopId(name, shop.getId());

        return IProductMapper.INSTANCE.toDTOs(productEntities);
    }

    @Override
    public List<ProductTop10DTO> getTop10ProductInDateRange(String startDate, String endDate) {
        ShopEntity shop = this.shopService.getShopLoggedIn();
        List<ICountProductQuantityWithStatus> products = this.productRepository.getTop10ProductInDateRange(startDate, endDate, shop.getId());
        List<ProductTop10DTO> productTop10DTOS = new ArrayList<>();
        products.forEach(product -> {
            ProductTop10DTO productTop10DTO = ProductTop10DTO.builder()
                    .productId(product.getProductId())
                    .productName(product.getProductName())
                    .status(product.getStatus())
                    .totalByStatus(product.getTotalByStatus()).build();

            productTop10DTOS.add(productTop10DTO);
        });
        return productTop10DTOS;
    }


}
