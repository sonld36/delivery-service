package com.mock.qlgiaohangback.dto.cod;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Data
public class ChangeStatusDTO {
    private Long idCod;
    private Integer status;
}
