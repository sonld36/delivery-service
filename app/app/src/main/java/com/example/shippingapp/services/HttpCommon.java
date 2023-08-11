package com.example.shippingapp.services;

import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public interface HttpCommon {
//    https://delivery-system.onrender.com/api/
    //10.0.2.2:8080
//    http://192.168.1.71:8080
//    https://delivery-service-7elcupesca-uc.a.run.app
    Retrofit httpCommon = new Retrofit.Builder().addConverterFactory(GsonConverterFactory.create()).baseUrl("https://delivery-service-7elcupesca-uc.a.run.app/api/").build();
    Retrofit httpGoogleMapApi = new Retrofit.Builder().addConverterFactory(GsonConverterFactory.create()).baseUrl("https://api.mapbox.com/directions/v5/mapbox/").build();
}
