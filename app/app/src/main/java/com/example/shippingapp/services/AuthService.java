package com.example.shippingapp.services;

import com.example.shippingapp.common.Constant;
import com.example.shippingapp.dto.CarrierRespDTO;
import com.example.shippingapp.dto.CountOrderByRangeDateDTO;
import com.example.shippingapp.dto.LoginRequest;
import com.example.shippingapp.dto.LoginRespDTO;
import com.example.shippingapp.dto.NotificationRespPaging;
import com.example.shippingapp.dto.OrderRespDTO;
import com.example.shippingapp.dto.ResponseTemplateDTO;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface AuthService {
    AuthService authService = HttpCommon.httpCommon.create(AuthService.class);

    @POST("auth/login")
    Call<ResponseTemplateDTO<LoginRespDTO>> login(@Body LoginRequest loginInfo);

    @GET("order/shipper")
    Call<ResponseTemplateDTO<List<OrderRespDTO>>> getOrder(@Header("Authorization") String authorization);


    @GET("order/shipper/status")
    Call<ResponseTemplateDTO<List<OrderRespDTO>>> getOrderByStatus(@Header("Authorization") String authorization, @Query("status") String status);
    @PUT("order/shipper/change-status")
    Call<ResponseTemplateDTO<Integer>> changeStatus(@Header("Authorization") String authorization, @Query("id") long id, @Query("status")Constant.OrderStatus status);

    @GET("notify/v2")
    Call<ResponseTemplateDTO<NotificationRespPaging>> getNotify(@Header("Authorization") String authorization, @Query("page") int page);

    @GET("notify/count-not-seen")
    Call<ResponseTemplateDTO<Integer>> getCountNotification(@Header("Authorization") String authorization);

    @PUT("notify/seen/{id}")
    Call<ResponseTemplateDTO<Integer>> setSeen(@Header("Authorization") String authorization, @Path("id") long id);

    @GET("carrier")
    Call<ResponseTemplateDTO<CarrierRespDTO>> getCarrierProfile(@Header("Authorization") String authorization);

    @GET("order/{id}")
    Call<ResponseTemplateDTO<OrderRespDTO>> getOrderById(@Header("Authorization") String authorization, @Path("id") long id);

    @PUT("carrier/{id}")
    Call<ResponseTemplateDTO<Integer>> changeCarrierActive(@Header("Authorization") String authorization, @Path("id") long id, @Query("geometric") String geometric, @Query("active") boolean active);

    @PUT("order/take-order/{id}")
    Call<ResponseTemplateDTO<Integer>> acceptOrder(@Header("Authorization") String authorization, @Path("id") long orderId);

    @PUT("carrier/reject-order/{id}")
    Call<ResponseTemplateDTO<Integer>> rejectOrder(@Header("Authorization") String authorization, @Path("id") long orderId);

    @GET("order/week-recent")
    Call<ResponseTemplateDTO<List<CountOrderByRangeDateDTO>>> getNumberOfOrderInWeekRecent(@Header("Authorization") String authorization);

}
