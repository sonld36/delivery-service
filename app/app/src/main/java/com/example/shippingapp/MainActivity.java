package com.example.shippingapp;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

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

    private ProgressBar progressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        this.username = findViewById(R.id.username);
        this.password = findViewById(R.id.password);
        progressBar = findViewById(R.id.progressBar);
        progressBar.setVisibility(View.INVISIBLE);
    }


    public void handleLogin(View view) {
        String usernameGot = username.getText().toString();
        String passwordGot = password.getText().toString();
        LoginRequest loginRequest = new LoginRequest(usernameGot, passwordGot);
        progressBar.setVisibility(View.VISIBLE);
        AuthService.authService.login(loginRequest).enqueue(new Callback<ResponseTemplateDTO<LoginRespDTO>>() {
            @Override
            public void onResponse(Call<ResponseTemplateDTO<LoginRespDTO>> call, Response<ResponseTemplateDTO<LoginRespDTO>> response) {
                //Tại đây sẽ handle việc lưu token và chuyển qua activity mới
                if (response.body() == null) {
                    progressBar.setVisibility(View.INVISIBLE);
                    Toast.makeText(MainActivity.this, "Có lỗi xảy ra", Toast.LENGTH_SHORT).show();
                    return;
                }
                Log.d("response info", "onResponse: " + new Gson().toJson(response.body()));
                ResponseTemplateDTO<LoginRespDTO> resp = response.body();
                Intent intent = new Intent(MainActivity.this, HomePage.class);
                progressBar.setVisibility(View.INVISIBLE);
                if (!resp.getData().getUser().getRole().equals("ROLE_CARRIER")) {
                    Toast.makeText(MainActivity.this, "Bạn không có quyền sử dụng", Toast.LENGTH_SHORT).show();
                    return;
                }
//                Intent socketService = new Intent(MainActivity.this, SocketService.class);
//                socketService.putExtra("user", new Gson().toJson(resp.getData().getUser()));
//                startService(socketService);
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