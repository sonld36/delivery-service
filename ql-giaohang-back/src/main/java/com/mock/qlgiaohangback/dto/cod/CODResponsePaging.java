package com.mock.qlgiaohangback.dto.cod;


import com.mock.qlgiaohangback.entity.CODEntity;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;

//@RequiredArgsConstructor
@Data
@Builder
public class CODResponsePaging {
    private List<CODInfoRespDTO> cods;
    private int totalPage;
}
