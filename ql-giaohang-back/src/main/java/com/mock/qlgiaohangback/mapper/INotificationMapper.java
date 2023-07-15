package com.mock.qlgiaohangback.mapper;

import com.mock.qlgiaohangback.dto.notification.NotificationRespDTO;
import com.mock.qlgiaohangback.entity.NotificationEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(uses = {IAccountMapper.class})
public interface INotificationMapper {
    INotificationMapper INSTANCE = Mappers.getMapper(INotificationMapper.class);

//    @Mapping(target = "destination", ignore = true)
//    @Mapping(target = "from", ignore = true)
    NotificationRespDTO toDTO(NotificationEntity notification);

    List<NotificationRespDTO> toListDTO(List<NotificationEntity> notifications);
}
