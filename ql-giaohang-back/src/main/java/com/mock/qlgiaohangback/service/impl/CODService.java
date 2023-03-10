package com.mock.qlgiaohangback.service.impl;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;
import java.util.stream.Collectors;

import com.mock.qlgiaohangback.common.MessageResponse;
import com.mock.qlgiaohangback.dto.cod.CODByDateAndShopId;
import com.mock.qlgiaohangback.dto.cod.CODInfoRespDTO;
import com.mock.qlgiaohangback.dto.cod.CODResponsePaging;
import com.mock.qlgiaohangback.dto.order.OrderByDateAndListId;
import com.mock.qlgiaohangback.dto.order.OrderRespDTO;
import com.mock.qlgiaohangback.entity.CODEntity;
import com.mock.qlgiaohangback.entity.OrderEntity;
import com.mock.qlgiaohangback.entity.ShopEntity;
import com.mock.qlgiaohangback.exception.ResponseException;
import com.mock.qlgiaohangback.mapper.ICODMapper;
import com.mock.qlgiaohangback.repository.CODRepository;
import com.mock.qlgiaohangback.repository.OrderRepository;
import com.mock.qlgiaohangback.repository.ShopRepository;
import com.mock.qlgiaohangback.service.ICODService;
import com.mock.qlgiaohangback.service.IShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.mock.qlgiaohangback.common.Constans;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CODService implements ICODService {

    private final CODRepository codRepository;

    private final OrderRepository orderRepository;

    private final IShopService shopService;

    @Override
    public CODEntity getCOD(CODByDateAndShopId body) {
        try {
            List<CODEntity> listCOD = this.codRepository.findCODByShopId(body.getShopId());
            if (listCOD.isEmpty()) {
                CODEntity cod = createCOD(body);
                return cod;
            }
            listCOD = listCOD.stream().filter(item -> {
                return item.getDate().equals(body.getDate());
            }).collect(Collectors.toList());
            if (listCOD.isEmpty())
            {
                CODEntity cod = createCOD(body);
                return cod;
            }  else {
                return listCOD.get(0);
            }
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public CODEntity createCOD(CODByDateAndShopId body) {
        CODEntity cod = new CODEntity();
        cod.setShopId(body.getShopId());
        cod.setDate(body.getDate());
        cod.setStatus(0);
        CODEntity codEntity = this.codRepository.save(cod);
        return codEntity;
    }

    @Override
    public Boolean payCOD(CODByDateAndShopId body) {
        try {
            List<CODEntity> listCOD = this.codRepository.findCODByShopId(body.getShopId());
            listCOD = listCOD.stream().filter(item -> {
                return item.getDate().equals(body.getDate());
            }).collect(Collectors.toList());
            CODEntity cod = listCOD.get(0);
            cod.setStatus(1);
            this.codRepository.save(cod);

            long shopId = cod.getShopId();
            String date = cod.getDate();
            List<OrderEntity> listOrder = this.orderRepository.findOrderEntytyByShopId(shopId);
            List<OrderEntity> returnOrders = listOrder.stream().filter(o -> {
                Calendar calendar = Calendar.getInstance();
                if (o.getCompletedAt() == null) return false;
                if (!o.getStatus().equals(Constans.OrderStatus.DELIVERY_SUCCESSFUL)) return false;
                calendar.setTime(o.getCompletedAt());
                int year = calendar.get(Calendar.YEAR);
                int month = calendar.get(Calendar.MONTH) + 1;
                int day = calendar.get(Calendar.DAY_OF_MONTH);
                String oDate = String.valueOf(day) + "/" + String.valueOf(month) + "/" + String.valueOf(year);
                return date.equals(oDate);
            }).collect(Collectors.toList());
            returnOrders.forEach(o -> {
                o.setStatus(Constans.OrderStatus.DONE);
                o.setCod(cod);
                this.orderRepository.save(o);
            });
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public CODResponsePaging getCODsByStatus(Integer status, Integer page) {
        if (page < 1) {
            throw new ResponseException(MessageResponse.VALUE_PASSED_INCORRECT, HttpStatus.BAD_REQUEST, Constans.Code.INVALID.getCode());
        }

        ShopEntity shop = this.shopService.getShopLoggedIn();

        Page<CODEntity> paging = this.codRepository.findByShopIdAndStatusOrderByCreatedAt(shop.getId(), status, PageRequest.of(page-1, Integer.parseInt(Constans.CommonConstant.SIZE_PAGE.getSomeThing().toString())));
        return CODResponsePaging.builder().totalPage(paging.getTotalPages()).cods(ICODMapper.INSTANCE.toListDTO(paging.getContent())).build();

    }

    @Transactional
    @Override
    public Integer updateStatus(Long id, Integer status) {
        CODEntity cod = this.codRepository.findById(id).orElseThrow(()->{
            throw new ResponseException(MessageResponse.NOT_FOUND, HttpStatus.BAD_REQUEST, Constans.Code.INVALID.getCode());
        });

        cod.setStatus(status);

        try {
            this.codRepository.save(cod);
            return 1;
        } catch (Exception e) {
            throw new ResponseException(MessageResponse.VALUE_PASSED_INCORRECT, HttpStatus.BAD_REQUEST, Constans.Code.INVALID.getCode());
        }
    }

    @Override
    public CODResponsePaging getCodDone(Integer page) {
        if (page < 1) {
            throw new ResponseException(MessageResponse.VALUE_PASSED_INCORRECT, HttpStatus.BAD_REQUEST, Constans.Code.INVALID.getCode());
        }

        ShopEntity shop = this.shopService.getShopLoggedIn();

        Page<CODEntity> codEntities = this.codRepository.getByShopIdAndStatusEqualsOrStatusEquals(shop.getId(), 2, 3, PageRequest.of(page-1, Integer.parseInt(Constans.CommonConstant.SIZE_PAGE.getSomeThing().toString())));

        return CODResponsePaging.builder().totalPage(codEntities.getTotalPages()).cods(ICODMapper.INSTANCE.toListDTO(codEntities.getContent())).build();
    }
}
