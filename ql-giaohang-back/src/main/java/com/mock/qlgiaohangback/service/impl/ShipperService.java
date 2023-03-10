package com.mock.qlgiaohangback.service.impl;


import com.mock.qlgiaohangback.repository.ShipperRepository;
import com.mock.qlgiaohangback.service.IShipperService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShipperService implements IShipperService {
    private final ShipperRepository shipperRepository;

}
