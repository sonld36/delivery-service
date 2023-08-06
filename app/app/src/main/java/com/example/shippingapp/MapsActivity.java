package com.example.shippingapp;

import android.content.Intent;
import android.graphics.Color;
import android.location.Location;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.coordinatorlayout.widget.CoordinatorLayout;
import androidx.fragment.app.FragmentActivity;

import com.example.shippingapp.common.Constant;
import com.example.shippingapp.common.MapDataParser;
import com.example.shippingapp.databinding.ActivityMapsBinding;
import com.example.shippingapp.dto.OrderRespDTO;
import com.example.shippingapp.dto.ResponseTemplateDTO;
import com.example.shippingapp.services.AuthService;
import com.example.shippingapp.services.GoogleMapService;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.PolylineOptions;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MapsActivity extends FragmentActivity implements OnMapReadyCallback {

    private GoogleMap mMap;
    private ActivityMapsBinding binding;

    private OrderRespDTO orderRespDTO;
    private Double longitude;
    private Double latitude;

    private Location curLocation;

    private CoordinatorLayout coordinatorLayout;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityMapsBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        Intent intent = getIntent();

        orderRespDTO = (OrderRespDTO) intent.getSerializableExtra("order");
        longitude = intent.getDoubleExtra("longitude", 0);
        latitude = intent.getDoubleExtra("latitude", 0);

        TextView fromAddress = binding.getRoot().findViewById(R.id.from_address_bottom);
        TextView desAddress = binding.getRoot().findViewById(R.id.destination_address_bottom);
        TextView shipFee = binding.getRoot().findViewById(R.id.ship_fee_dialog_bottom);

        Button decline = binding.getRoot().findViewById(R.id.decline_button_bottom);
        Button accept = binding.getRoot().findViewById(R.id.accept_button_bottom);
        if (orderRespDTO != null) {
            decline.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    AuthService.authService.rejectOrder(HomePage.token, orderRespDTO.getId()).enqueue(new Callback<ResponseTemplateDTO<Integer>>() {
                        @Override
                        public void onResponse(Call<ResponseTemplateDTO<Integer>> call, Response<ResponseTemplateDTO<Integer>> response) {
                            if (response.body().getCode().longValue() == Constant.Code.UPDATE_ACCOUNT_SUCCESSFUL.getCode()) {
                                Toast.makeText(MapsActivity.this, "Từ chối đơn hàng thành công", Toast.LENGTH_SHORT).show();
                                finish();
                            }
                        }

                        @Override
                        public void onFailure(Call<ResponseTemplateDTO<Integer>> call, Throwable t) {

                        }
                    });
                }
            });

            accept.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    AuthService.authService.acceptOrder(HomePage.token, orderRespDTO.getId()).enqueue(new Callback<ResponseTemplateDTO<Integer>>() {
                        @Override
                        public void onResponse(Call<ResponseTemplateDTO<Integer>> call, Response<ResponseTemplateDTO<Integer>> response) {
                            Log.d("Accept", "onResponse: " + response);
                            ResponseTemplateDTO<Integer> resp = response.body();
                            if (resp.getCode().longValue() == Constant.Code.TAKE_A_ORDER_SUCCESSFUL.getCode()) {
                                Toast.makeText(MapsActivity.this, "Nhận đơn hàng thành công", Toast.LENGTH_SHORT).show();
                                Intent intentToOrderDetail = new Intent(MapsActivity.this, OrderDetail.class);
                                intentToOrderDetail.putExtra("order_id", orderRespDTO.getId());
                                startActivity(intentToOrderDetail);
                                finish();
                            }
                            if (resp.getCode().longValue() == Constant.Code.ORDER_WAS_ASSIGNED.getCode()) {
                                Toast.makeText(MapsActivity.this, "Đơn hàng đã được vận chuyển", Toast.LENGTH_SHORT).show();
                                finish();
                            }
                        }

                        @Override
                        public void onFailure(Call<ResponseTemplateDTO<Integer>> call, Throwable t) {

                        }
                    });
                }
            });
            fromAddress.setText(orderRespDTO.getFromAddress());
            desAddress.setText(orderRespDTO.getDestinationAddress());
            shipFee.setText(Double.toString(orderRespDTO.getShipFee()));
        } else {
            decline.setEnabled(false);
            accept.setEnabled(false);
            coordinatorLayout = findViewById(R.id.coordinator);
            coordinatorLayout.setVisibility(View.INVISIBLE);
        }

        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);
    }

    /**
     * Manipulates the map once available.
     * This callback is triggered when the map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     */
    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
        // Add a marker in Sydney and move the camera
        if (longitude != null || latitude != null) {
            LatLng end = new LatLng(latitude, longitude);
            LatLng start = new LatLng(HomePage.updateLocationDTO.getLatitude(),HomePage.updateLocationDTO.getLongitude());
            mMap.addMarker(new MarkerOptions().position(end));
            mMap.addMarker(new MarkerOptions().position(start).title("Vị trí hiện tại"));
            GoogleMapService.mapService.getDirectionV2(start.longitude + "," + start.latitude + ";" +
                    end.longitude + "," + end.latitude).enqueue(new Callback<JsonObject>() {
                @Override
                public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                    List<List<HashMap<String,String>>> geometric = MapDataParser.parse(response.body());
                    Double duration = ((JsonObject) response.body().getAsJsonArray("routes").get(0)).get("duration_typical").getAsDouble();
                    Double distance = ((JsonObject) response.body().getAsJsonArray("routes").get(0)).get("distance").getAsDouble();
                    coordinatorLayout = findViewById(R.id.coordinator);
                    TextView distanceText = coordinatorLayout.findViewById(R.id.distance);
                    TextView durationText = coordinatorLayout.findViewById(R.id.time);
                    distanceText.setText(Double.toString((distance/1000)) + " km");
                    durationText.setText(Double.toString(duration/60) + " phút");
                    coordinatorLayout.setVisibility(View.VISIBLE);

                    ArrayList<LatLng> points;
                    PolylineOptions lineOptions = null;

                    for (int i = 0; i < geometric.size(); i++) {
                        points = new ArrayList<>();
                        lineOptions = new PolylineOptions();

                        List<HashMap<String, String>> path = geometric.get(i);

                        for (int j = 0; j < path.size(); j++) {
                            HashMap<String, String> point = path.get(j);
                            double lat = Double.parseDouble(point.get("lat"));
                            double lng = Double.parseDouble(point.get("lng"));
                            LatLng position = new LatLng(lat, lng);
                            points.add(position);
                        }

                        lineOptions.addAll(points);
                        lineOptions.width(20);
                        lineOptions.color(Color.GREEN);
                    }
                    if(lineOptions != null) {
                        mMap.addPolyline(lineOptions);
                    }
                }

                @Override
                public void onFailure(Call<JsonObject> call, Throwable t) {

                }
            });
            mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(new LatLng(latitude, longitude), 15.0f));

        } else {
//            Polyline line = mMap.addPolyline(new PolylineOptions()
//                    .add(new LatLng(orderRespDTO.getDestinationLat(),orderRespDTO.getDestinationLongitude()), new LatLng(orderRespDTO.getShop().getLatitude(),orderRespDTO.getShop().getLongitude()))
//                    .addSpan(new StyleSpan(Color.RED))
//                    .addSpan(new StyleSpan(Color.GREEN)));
            GoogleMapService.mapService.getDirectionV2(orderRespDTO.getShop().getLongitude() + "," + orderRespDTO.getShop().getLatitude() + ";" +
                    orderRespDTO.getDestinationLongitude() + "," + orderRespDTO.getDestinationLat()).enqueue(new Callback<JsonObject>() {
                @Override
                public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                    List<List<HashMap<String,String>>> geometric = MapDataParser.parse(response.body());
                    Double duration = ((JsonObject) response.body().getAsJsonArray("routes").get(0)).get("duration_typical").getAsDouble();
                    Double distance = ((JsonObject) response.body().getAsJsonArray("routes").get(0)).get("distance").getAsDouble();
                    coordinatorLayout = findViewById(R.id.coordinator);
                    TextView distanceText = coordinatorLayout.findViewById(R.id.distance);
                    TextView durationText = coordinatorLayout.findViewById(R.id.time);
                    distanceText.setText(Double.toString((distance/1000)) + " km");
                    durationText.setText(Double.toString(duration/60) + " phút");
                    coordinatorLayout.setVisibility(View.VISIBLE);

                    ArrayList<LatLng> points;
                    PolylineOptions lineOptions = null;

                    for (int i = 0; i < geometric.size(); i++) {
                        points = new ArrayList<>();
                        lineOptions = new PolylineOptions();

                        List<HashMap<String, String>> path = geometric.get(i);

                        for (int j = 0; j < path.size(); j++) {
                            HashMap<String, String> point = path.get(j);
                            double lat = Double.parseDouble(point.get("lat"));
                            double lng = Double.parseDouble(point.get("lng"));
                            LatLng position = new LatLng(lat, lng);
                            points.add(position);
                        }

                        lineOptions.addAll(points);
                        lineOptions.width(20);
                        lineOptions.color(Color.GREEN);
                    }
                    if(lineOptions != null) {
                        mMap.addPolyline(lineOptions);
                    }
                }

                @Override
                public void onFailure(Call<JsonObject> call, Throwable t) {

                }
            });

            mMap.moveCamera(CameraUpdateFactory.newLatLng(new LatLng(orderRespDTO.getDestinationLat(),orderRespDTO.getDestinationLongitude())));
        }
    }

}