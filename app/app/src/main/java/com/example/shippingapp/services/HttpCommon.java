package com.example.shippingapp.services;

import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public interface HttpCommon {
    Retrofit httpCommon = new Retrofit.Builder().addConverterFactory(GsonConverterFactory.create()).baseUrl("http://10.0.2.2:8080/api/").build();
    Retrofit httpGoogleMapApi = new Retrofit.Builder().addConverterFactory(GsonConverterFactory.create()).baseUrl("https://maps.googleapis.com/maps/api/directions/").build();
}
