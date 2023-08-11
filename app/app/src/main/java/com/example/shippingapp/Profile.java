package com.example.shippingapp;

import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.widget.CompoundButton;
import android.widget.Switch;
import android.widget.TextView;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;

import com.example.shippingapp.dto.CarrierRespDTO;
import com.example.shippingapp.dto.CountOrderByRangeDateDTO;
import com.example.shippingapp.dto.ResponseTemplateDTO;
import com.example.shippingapp.dto.UpdateLocationDTO;
import com.example.shippingapp.services.AuthService;
import com.github.mikephil.charting.charts.BarChart;
import com.github.mikephil.charting.data.BarData;
import com.github.mikephil.charting.data.BarDataSet;
import com.github.mikephil.charting.data.BarEntry;
import com.github.mikephil.charting.utils.ColorTemplate;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class Profile extends AppCompatActivity {

    private Switch toggle;

    private BarChart barChart;
    private BarData barData;
    private BarDataSet barDataSet;
    private List barEntriesArrayList;

    private CarrierRespDTO carrierRespDTO;

    private TextView name;

    @RequiresApi(api = Build.VERSION_CODES.TIRAMISU)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        Intent intent = getIntent();
        long userId = (long) intent.getSerializableExtra("userId");
        UpdateLocationDTO updateLocationDTO = (UpdateLocationDTO) intent.getSerializableExtra("latestLocation");

        toggle = findViewById(R.id.available_switch);
        barChart = findViewById(R.id.idBarChart);
        carrierRespDTO = new CarrierRespDTO();
        name = findViewById(R.id.name_profile);
        AuthService.authService.getCarrierProfile(HomePage.token).enqueue(new Callback<ResponseTemplateDTO<CarrierRespDTO>>() {
            @Override
            public void onResponse(Call<ResponseTemplateDTO<CarrierRespDTO>> call, Response<ResponseTemplateDTO<CarrierRespDTO>> response) {
                CarrierRespDTO resp = response.body().getData();
                name.setText(resp.getName());
                toggle.setChecked(resp.isActive());
            }

            @Override
            public void onFailure(Call<ResponseTemplateDTO<CarrierRespDTO>> call, Throwable t) {

            }
        });
        getCountOrderByRangeDate();


        toggle.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                AuthService.authService.changeCarrierActive(HomePage.token, userId,
                        updateLocationDTO.getLongitude() + "," + updateLocationDTO.getLatitude(),
                        isChecked).enqueue(new Callback<ResponseTemplateDTO<Integer>>() {
                    @Override
                    public void onResponse(Call<ResponseTemplateDTO<Integer>> call, Response<ResponseTemplateDTO<Integer>> response) {
                        int resp = response.body().getData();

                        Log.d("Hello", "onResponse: " + resp);
                    }

                    @Override
                    public void onFailure(Call<ResponseTemplateDTO<Integer>> call, Throwable t) {

                    }
                });
            }
        });
    }

    public void getCountOrderByRangeDate() {
        barEntriesArrayList = new ArrayList();
        AuthService.authService.getNumberOfOrderInWeekRecent(HomePage.token).enqueue(new Callback<ResponseTemplateDTO<List<CountOrderByRangeDateDTO>>>() {
            @Override
            public void onResponse(Call<ResponseTemplateDTO<List<CountOrderByRangeDateDTO>>> call, Response<ResponseTemplateDTO<List<CountOrderByRangeDateDTO>>> response) {
                List<CountOrderByRangeDateDTO> res = response.body().getData();
                for (int i = 0; i < res.size(); i++) {
                    barEntriesArrayList.add(new BarEntry(Float.sum(i, 1), res.get(i).getCountOrder()));
                }

                barDataSet = new BarDataSet(barEntriesArrayList, "1 Tuần vừa qua");
                barData = new BarData(barDataSet);
                barChart.setData(barData);

                barDataSet.setColors(ColorTemplate.MATERIAL_COLORS);

                // setting text color.
                barDataSet.setValueTextColor(Color.BLACK);

                // setting text size
                barDataSet.setValueTextSize(16f);
                barChart.getDescription().setEnabled(false);
            }

            @Override
            public void onFailure(Call<ResponseTemplateDTO<List<CountOrderByRangeDateDTO>>> call, Throwable t) {

            }
        });
    }

    public CarrierRespDTO getCarrierRespDTO() {
        return this.carrierRespDTO;
    }

}