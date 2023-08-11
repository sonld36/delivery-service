package com.mock.qlgiaohangback.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.dto.notification.UpdateLocationDTO;
import com.mock.qlgiaohangback.helpers.StringHelper;
import com.mock.qlgiaohangback.service.ICarrierService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;


@Controller
@RequiredArgsConstructor
@Log4j2
public class SocketController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ICarrierService carrierService;

    @MessageMapping("/location")
    public void updateLocation(String updateLocationString) throws JsonProcessingException {
        String stringToHandle = updateLocationString.replace("UpdateLocationDTO", "");
        UpdateLocationDTO updateLocationDTO = new ObjectMapper().readValue(stringToHandle, UpdateLocationDTO.class);
        log.info(updateLocationDTO);
        this.carrierService.updateLocationCarrierByAccountId(updateLocationDTO.getUserId(), updateLocationDTO.getLongitude(), updateLocationDTO.getLatitude());
        simpMessagingTemplate.convertAndSend(StringHelper.getSocketTopic(Constans.SocketTopic.LOCATION) + "/" + updateLocationDTO.getUserId(), updateLocationDTO);
    }
}
