package com.mock.qlgiaohangback.mapper;

import com.mock.qlgiaohangback.dto.order_product.OrderProductRespDTO;
import com.mock.qlgiaohangback.dto.product.ProductInOrderCreateDTO;
import com.mock.qlgiaohangback.entity.OrderProductEntity;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(uses = {IProductMapper.class})
public interface IOrderProductMapper {
    IOrderProductMapper INSTANCE = Mappers.getMapper(IOrderProductMapper.class);

    //    @Mapping(source = "order.orderProductId.orderId", target = "orderId")
//    @Mapping(source = "order.orderProductId.productId", target = "productId")
    OrderProductRespDTO toOrderProductRespDTO(OrderProductEntity order);

    @Mapping(source = "id", target = "product.id")
    @Mapping(source = "quantity", target = "productQuantity")
    @Mapping(source = "salePrice", target = "productPrice")
    OrderProductEntity toEntity(ProductInOrderCreateDTO product);


    //    List<OrderProductEntity> toListEntity(List<ProductInOrderCreateDTO> products);
    @Named(value = "productToOrderProduct")
    @Mapping(source = "product.id", target = "orderProductId.productId")
    @Mapping(source = "product.quantity", target = "productQuantity")
    @Mapping(source = "product.salePrice", target = "productPrice")
    OrderProductEntity fromProductToOrderProduct(ProductInOrderCreateDTO product);

//    @Mapping(source = "product.id", target = "orderProductId.productId")

    @IterableMapping(qualifiedByName = "productToOrderProduct")
    List<OrderProductEntity> fromProductsToOrderProducts(List<ProductInOrderCreateDTO> product);
}
