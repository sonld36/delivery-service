package com.example.shippingapp.services;

import android.os.AsyncTask;
import android.util.Log;

import com.example.shippingapp.common.MapDataParser;
import com.google.android.gms.maps.model.LatLng;
import com.google.gson.JsonObject;

import java.util.HashMap;
import java.util.List;

import lombok.Data;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

@Data
public class MapService extends AsyncTask<String, Void, Void> {

    public static final String URL_MAP_DIRECTION = "https://maps.googleapis.com/maps/api/directions/json" +
            "?destination=%s" +
            "&origin=%s" +
            "&key=AIzaSyBGKCnH07H87jpYwFEAf48xVgKS_AgBlIM";
    private LatLng origin;
    private LatLng destination;

    private List<List<HashMap<String,String>>> geometric;


    public MapService(LatLng origin, LatLng destination) {
        this.origin = origin;
        this.destination = destination;
    }

    private String getURLDirection() {
        return String.format(URL_MAP_DIRECTION, this.destination.latitude + "," + this.destination.longitude, this.origin.latitude + "," + this.origin.longitude);
    }

    public void getDirection() {
        GoogleMapService.mapService.getDirection(destination.latitude + "," + destination.longitude,
                origin.latitude + "," + origin.longitude,
                "AIzaSyC8MxVTaIKHbjmJ9-sfQ-lT7Vs4Lm-xk7s").enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                Log.d("hello", "onResponse: " + response.body());
                if (geometric != null) {
                    geometric.clear();
                    geometric.addAll(MapDataParser.parse(response.body()));
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {

            }
        });
    }

//    public void getDirection() throws IOException {
//        StringBuilder sb=null;
//        BufferedReader reader=null;
//        String serverResponse=null;
//        URL url = new URL(getURLDirection());
//        OkHttpClient client = new OkHttpClient().newBuilder().build();
//        MediaType mediaType = MediaType.parse("text/plain");
//        RequestBody body = RequestBody.create(mediaType, "");
//        Request request = new Request.Builder()
//                .url(getURLDirection()).method("GET", null).build();
//        Response response = client.newCall(request).execute();
//        Log.d("response", "getDirection: " + response);
//    }


    @Override
    protected Void doInBackground(String... strings) {
        GoogleMapService.mapService.getDirection(destination.latitude + "," + destination.longitude,
                origin.latitude + "," + origin.longitude,
                "AIzaSyC8MxVTaIKHbjmJ9-sfQ-lT7Vs4Lm-xk7s").enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                Log.d("hello", "onResponse: " + response.body());
                if (geometric != null) {
                    geometric.clear();
                    geometric.addAll(MapDataParser.parse(response.body()));
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {

            }
        });

        return null;
    }
}
