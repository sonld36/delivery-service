package com.example.shippingapp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import com.example.shippingapp.dto.LoginRequest;
import com.example.shippingapp.dto.LoginRespDTO;
import com.example.shippingapp.dto.ResponseTemplateDTO;
import com.example.shippingapp.services.AuthService;
import com.google.gson.Gson;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity {

    private EditText username;
    private EditText password;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        this.username = findViewById(R.id.username);
        this.password = findViewById(R.id.password);
    }


    public void handleLogin(View view) {
        String usernameGot = username.getText().toString();
        String passwordGot = password.getText().toString();
        LoginRequest loginRequest = new LoginRequest(usernameGot, passwordGot);
        AuthService.authService.login(loginRequest).enqueue(new Callback<ResponseTemplateDTO<LoginRespDTO>>() {
            @Override
            public void onResponse(Call<ResponseTemplateDTO<LoginRespDTO>> call, Response<ResponseTemplateDTO<LoginRespDTO>> response) {
                //Tại đây sẽ handle việc lưu token và chuyển qua activity mới
                Log.d("response info", "onResponse: " + new Gson().toJson(response.body()));
                ResponseTemplateDTO<LoginRespDTO> resp = response.body();
                Intent intent = new Intent(MainActivity.this, HomePage.class);
                assert resp != null;
                intent.putExtra("user", new Gson().toJson(resp.getData().getUser()));
                intent.putExtra("token", resp.getData().getToken());
                startActivity(intent);
                Toast.makeText(MainActivity.this, "call API successful", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onFailure(Call<ResponseTemplateDTO<LoginRespDTO>> call, Throwable t) {
                Toast.makeText(MainActivity.this, "call API error", Toast.LENGTH_SHORT).show();
            }
        });
    }
}