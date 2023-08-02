package com.example.shippingapp;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.example.shippingapp.common.Constant;
import com.example.shippingapp.dto.MessageDTO;
import com.example.shippingapp.dto.NotificationRespDTO;
import com.example.shippingapp.dto.ResponseTemplateDTO;
import com.example.shippingapp.dto.ResponseWithPagingDTO;
import com.example.shippingapp.services.AuthService;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.EnumSet;
import java.util.List;
import java.util.stream.Collectors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class NotifyPage extends AppCompatActivity {



    public int currentPage;

    public static int totalPage;

    private LinearLayout notificationDisplay;

    private static List<NotificationRespDTO> notifications = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_notify_page);

        notificationDisplay = findViewById(R.id.notification_display_item);

        getNotificationByPage(1);

    }


    private void getNotificationByPage(int page) {
        AuthService.authService.getNotify(HomePage.token, page).enqueue(new Callback<ResponseTemplateDTO<ResponseWithPagingDTO<List<NotificationRespDTO>>>>() {
            @Override
            public void onResponse(Call<ResponseTemplateDTO<ResponseWithPagingDTO<List<NotificationRespDTO>>>> call, Response<ResponseTemplateDTO<ResponseWithPagingDTO<List<NotificationRespDTO>>>> response) {
                assert response.body() != null;
                ResponseWithPagingDTO<List<NotificationRespDTO>> resp = response.body().getData();
                NotifyPage.totalPage = resp.getTotalPage();
                notifications = resp.getPaging();
                setItemNotificationIntoLayout();
//                int count = (int) notifications.stream().filter((item) -> {
//                    return !item.isSeen();
//                }).count();
//                if (countNotificationsText != null) countNotificationsText.setText(String.valueOf(count));

            }

            @Override
            public void onFailure(Call<ResponseTemplateDTO<ResponseWithPagingDTO<List<NotificationRespDTO>>>> call, Throwable t) {

            }
        });
    }


    private void setItemNotificationIntoLayout() {
        List<String> status = EnumSet.allOf(Constant.OrderStatus.class).stream().map(Enum::name).collect(Collectors.toList());
        SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm");
        Gson gson = new Gson();
        notifications.forEach((item) -> {
            final View componentItemNotify = getLayoutInflater().inflate(R.layout.item_notify, null, false);
            TextView nameFrom = componentItemNotify.findViewById(R.id.notify_name_from);
            TextView createdAt = componentItemNotify.findViewById(R.id.notify_created);
            TextView messageFrom = componentItemNotify.findViewById(R.id.notify_action);
            String name = item.getFrom() == null ? "Hệ thống" : item.getFrom().getName();
            Date date = item.getCreatedAt();
            String dateFormed = date != null ? formatter.format(date) : "Không xác định";
            nameFrom.setText(name);
            createdAt.setText(dateFormed);
            if (status.contains(item.getTitle())) {
                Type integerType = new TypeToken<MessageDTO<Long>>() {}.getType();
                MessageDTO<Long> messageDTO = gson.fromJson(item.getMessage(),  integerType);
                messageFrom.setText(messageDTO.getMessage());
                try {
                    if (messageDTO.getData() != null) {
                        componentItemNotify.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                Intent intent = new Intent(NotifyPage.this, OrderDetail.class);
                                intent.putExtra("order_id", messageDTO.getData());
                                startActivity(intent);
                            }
                        });
                    }
                } catch (ArrayIndexOutOfBoundsException e) {
                    throw new RuntimeException(e);
                }
            } else {
                JsonParser parser = new JsonParser();
                JsonObject message = (JsonObject) parser.parse(item.getMessage());
                String messageGot = message.get("message").toString();
                try {
                    String[] getOrderId = messageGot.split("#");
                    if (getOrderId.length == 2) {
                        Long orderId = Long.parseLong(getOrderId[1].replace("\"", ""));
                        componentItemNotify.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                Intent intent = new Intent(NotifyPage.this, OrderDetail.class);
                                intent.putExtra("order_id", orderId);
                                startActivity(intent);
                            }
                        });
                    }
                } catch (ArrayIndexOutOfBoundsException e) {
                    throw new RuntimeException(e);
                }
                messageFrom.setText(messageGot);
            }
            notificationDisplay.addView(componentItemNotify);
        });
    }

    public void handleBackToHome(View view) {
        finish();
    }
}