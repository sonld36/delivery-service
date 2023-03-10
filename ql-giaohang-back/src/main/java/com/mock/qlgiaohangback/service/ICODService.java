package com.mock.qlgiaohangback.service;

import com.mock.qlgiaohangback.dto.cod.CODByDateAndShopId;
import com.mock.qlgiaohangback.dto.cod.CODInfoRespDTO;
import com.mock.qlgiaohangback.dto.cod.CODResponsePaging;
import com.mock.qlgiaohangback.dto.order.OrderByDateAndListId;
import com.mock.qlgiaohangback.entity.CODEntity;

import java.util.List;

public interface ICODService {
    CODEntity getCOD(CODByDateAndShopId body);

    CODEntity createCOD(CODByDateAndShopId body);

    Boolean payCOD(CODByDateAndShopId body);

    CODResponsePaging getCODsByStatus(Integer status, Integer page);

    Integer updateStatus(Long id, Integer status);

    CODResponsePaging getCodDone(Integer page);


}
