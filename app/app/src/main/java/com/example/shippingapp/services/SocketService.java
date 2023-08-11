package com.example.shippingapp.services;

import android.annotation.SuppressLint;
import android.content.Context;
import android.os.AsyncTask;
import android.util.Log;
import android.widget.Toast;

import com.example.shippingapp.dto.AccountRespDTO;
import com.example.shippingapp.dto.OrderRespDTO;
import com.example.shippingapp.dto.SocketResponse;
import com.google.gson.Gson;

import ua.naiksoftware.stomp.Stomp;
import ua.naiksoftware.stomp.StompClient;

public class SocketService extends AsyncTask<Void, Void, String> {

    public static StompClient stompClient;
    private AccountRespDTO user;

    private Context context;

    public StompClient getStompClient() {
        return stompClient;
    }

    //    delivery-system.onrender.com
    //10.0.2.2:8080
//    192.168.1.71:8080
//    https://delivery-service-7elcupesca-uc.a.run.app
    private static final String ip = "ws://delivery-service-7elcupesca-uc.a.run.app/api/socket/websocket";

    public SocketService(Context context, AccountRespDTO user) {
        this.user = user;
        this.context = context;
    }

    @Override
    protected void onPreExecute() {
        super.onPreExecute();
        stompClient = Stomp.over(Stomp.ConnectionProvider.OKHTTP, ip);
    }

    @SuppressLint("CheckResult")
    @Override
    protected String doInBackground(Void... voids) {
//        String userString = intent.getStringExtra("user");
//        user = new Gson().fromJson(userString, AccountRespDTO.class);
//        Log.d("Command", "onStartCommand: " + user);
        stompClient = Stomp.over(Stomp.ConnectionProvider.OKHTTP, ip);
        stompClient.connect();

        stompClient.topic("/notify/order-request/" + user.getId()).subscribe(topicMess -> {
            SocketResponse<OrderRespDTO> orderRequest = new Gson().fromJson(topicMess.getPayload(), SocketResponse.class);
            toast(orderRequest.getMessage());
//            notifications.add(NotificationRespDTO.builder().message(orderRequest.getMessage()).seen(false).build());
        }, throwable -> {
            Log.d("socket", throwable.getMessage());
        });

//        stompClient.topic("/request_shipping/" + user.getId()).subscribe(topicMess -> {
//            Type type = new TypeToken<SocketResponse<OrderRespDTO>>() {}.getType();
//            SocketResponse<Integer> orderResp = new Gson().fromJson(topicMess.getPayload(), type);
//            HomePage.queue.add(orderResp);
//        }, throwable -> {
//            Log.d("socket", throwable.getMessage());
//        });
        return null;
    }


    private void toast(String text) {
        Toast.makeText(context, text, Toast.LENGTH_SHORT).show();
    }

    public void registerAlarm(Context context) {

    }

}
