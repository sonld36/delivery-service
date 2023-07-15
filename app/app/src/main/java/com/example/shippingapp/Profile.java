package com.example.shippingapp;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.widget.CompoundButton;
import android.widget.Switch;

import com.example.shippingapp.dto.UpdateLocationDTO;
import com.example.shippingapp.services.AuthService;

public class Profile extends AppCompatActivity {

    private Switch toggle;

    @RequiresApi(api = Build.VERSION_CODES.TIRAMISU)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        Intent intent = getIntent();
        long userId = (long) intent.getSerializableExtra("userId");
        UpdateLocationDTO updateLocationDTO = (UpdateLocationDTO) intent.getSerializableExtra("latestLocation");

        toggle = findViewById(R.id.available_switch);

        toggle.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                AuthService.authService.changeCarrierActive(HomePage.token, userId, updateLocationDTO.getLongitude() + "," + updateLocationDTO.getLatitude());
            }
        });
    }
}