package com.mock.qlgiaohangback.service;

import com.mock.qlgiaohangback.dto.shipper.ShipperResponseDTO;
import com.mock.qlgiaohangback.dto.shipper.ShipperResponsePaging;

import java.util.List;

public interface IShipperService {
    ShipperResponsePaging<List<ShipperResponseDTO>> getShipper(Integer page);
}
