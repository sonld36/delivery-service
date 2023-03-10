package com.mock.qlgiaohangback.mapper;

import com.mock.qlgiaohangback.dto.product.ProductCreateDTO;
import com.mock.qlgiaohangback.dto.product.ProductRespDTO;
import com.mock.qlgiaohangback.dto.product.ProductUpdateDTO;
import com.mock.qlgiaohangback.entity.ProductEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(uses = {IShopMapper.class})
public interface IProductMapper {
    IProductMapper INSTANCE = Mappers.getMapper(IProductMapper.class);

    @Mapping(source = "shop.id", target = "shopId")
    ProductRespDTO toDTO(ProductEntity productEntity);

//    ProductRespDTO toProductRespDTO(ProductEntity order);

    List<ProductRespDTO> toDTOs(List<ProductEntity> productEntities);

    @Mapping(source = "image", target = "pathImage", ignore = true)
    ProductEntity toEntity(ProductCreateDTO productCreateDTO);

    @Mapping(source = "image", target = "pathImage", ignore = true)
    ProductEntity toEntityUpdate(ProductUpdateDTO productUpdateDTO);


}
    