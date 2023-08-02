package com.example.shippingapp.services;

import android.os.AsyncTask;

import com.example.shippingapp.dto.AccountRespDTO;

import ua.naiksoftware.stomp.Stomp;
import ua.naiksoftware.stomp.StompClient;

public class SocketService extends AsyncTask<Void, Void, String> {

    public static StompClient stompClient;
    private AccountRespDTO user;
    private static final String ip = "ws://10.0.2.2:8080/api/socket/websocket";

    public SocketService(AccountRespDTO user) {
        this.user = user;
    }

    @Override
    protected void onPreExecute() {
        super.onPreExecute();
        stompClient = Stomp.over(Stomp.ConnectionProvider.OKHTTP, ip);
        stompClient.connect();
    }

    @Override
    protected String doInBackground(Void... voids) {
//        String userString = intent.getStringExtra("user");
//        user = new Gson().fromJson(userString, AccountRespDTO.class);
//        Log.d("Command", "onStartCommand: " + user);
//        stompClient = Stomp.over(Stomp.ConnectionProvider.OKHTTP, ip);
//        stompClient.connect();
//        stompClient.topic("/notify/order-request/" + user.getId()).subscribe(topicMess -> {
//            SocketResponse<OrderRespDTO> orderRequest = new Gson().fromJson(topicMess.getPayload(), SocketResponse.class);
////            toast(orderRequest.getMessage());
////            notifications.add(NotificationRespDTO.builder().message(orderRequest.getMessage()).seen(false).build());
//        }, throwable -> {
//            Log.d("socket", throwable.getMessage());
//        });

//        stompClient.topic("/request_shipping/" + user.getId()).subscribe(topicMess -> {
//            Type type = new TypeToken<SocketResponse<OrderRespDTO>>() {}.getType();
//            SocketResponse<OrderRespDTO> orderResp = new Gson().fromJson(topicMess.getPayload(), type);
////            displayAlertDialog(orderResp.getData(), orderResp.getMessage());
//        }, throwable -> {
//            Log.d("socket", throwable.getMessage());
//        });
        return null;
    }



}
