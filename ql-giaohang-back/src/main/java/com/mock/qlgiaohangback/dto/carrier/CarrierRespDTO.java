package com.mock.qlgiaohangback.dto.carrier;

import com.mock.qlgiaohangback.dto.order.OrderRespDTO;
import com.mock.qlgiaohangback.dto.user.AccountRespDTO;
import com.mock.qlgiaohangback.entity.AccountEntity;
import com.mock.qlgiaohangback.entity.OrderEntity;
import lombok.*;

import javax.persistence.*;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CarrierRespDTO {
    private Long id;

    private Long accountId;

    private String name;

    private Double longitudeNewest;

    private Double latitudeNewest;

    private String phoneNumber;

    private boolean isActive;

    private boolean available;

    private String pathAvatar;
}
