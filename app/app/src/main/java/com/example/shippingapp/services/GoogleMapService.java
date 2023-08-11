package com.example.shippingapp.services;

import com.google.gson.JsonObject;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface GoogleMapService {


    GoogleMapService mapService = HttpCommon.httpGoogleMapApi.create(GoogleMapService.class);
    @GET("json")
    Call<JsonObject> getDirection(@Query("destination") String longLatEnd, @Query("origin") String longLatStart, @Query("key") String key);

    @GET("driving-traffic/{longlat}?annotations=maxspeed&language=vi_VN&steps=true&overview=full&geometries=geojson&access_token=pk.eyJ1IjoibWFib25nIiwiYSI6ImNrMm9qN2tiYTEwc3ozZG41emx6bW9uZnQifQ.PhojWq3UwsAlPB7LBvJiTw")
    Call<JsonObject> getDirectionV2(@Path("longlat") String longLat);
}
