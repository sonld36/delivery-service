package com.example.shippingapp.services;

import com.google.gson.JsonObject;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Query;

public interface GoogleMapService {


    GoogleMapService mapService = HttpCommon.httpGoogleMapApi.create(GoogleMapService.class);
    @GET("json")
    Call<JsonObject> getDirection(@Query("destination") String longLatEnd, @Query("origin") String longLatStart, @Query("key") String key);
}
