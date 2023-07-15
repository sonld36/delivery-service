package com.example.shippingapp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.JsonReader;
import android.util.Log;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.example.shippingapp.dto.NotificationRespDTO;
import com.example.shippingapp.dto.ResponseTemplateDTO;
import com.example.shippingapp.dto.ResponseWithPagingDTO;
import com.example.shippingapp.services.AuthService;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import org.w3c.dom.Text;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

        setItemNotificationIntoLayout();
    }


    private void getNotificationByPage(int page) {
        AuthService.authService.getNotify(HomePage.token, page).enqueue(new Callback<ResponseTemplateDTO<ResponseWithPagingDTO<List<NotificationRespDTO>>>>() {
            @Override
            public void onResponse(Call<ResponseTemplateDTO<ResponseWithPagingDTO<List<NotificationRespDTO>>>> call, Response<ResponseTemplateDTO<ResponseWithPagingDTO<List<NotificationRespDTO>>>> response) {
                assert response.body() != null;
                ResponseWithPagingDTO<List<NotificationRespDTO>> resp = response.body().getData();
                NotifyPage.totalPage = resp.getTotalPage();
                notifications = resp.getPaging();
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
        notifications.forEach((item) -> {
            final View componentItemNotify = getLayoutInflater().inflate(R.layout.item_notify, null, false);
            TextView nameFrom = componentItemNotify.findViewById(R.id.notify_name_from);
            TextView createdAt = componentItemNotify.findViewById(R.id.notify_created);
            TextView messageFrom = componentItemNotify.findViewById(R.id.notify_action);
            String name = item.getFrom() == null ? "Không xác định" : item.getFrom().getName();
            String date = item.getCreateAt() == null ? "Không xác định" : item.getCreateAt().toString();
            JsonParser parser = new JsonParser();
            JsonObject message = (JsonObject) parser.parse(item.getMessage());
            nameFrom.setText(name);
            createdAt.setText(date);
            String messageGot = message.get("message").toString();
            messageFrom.setText(messageGot);
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
            notificationDisplay.addView(componentItemNotify);
        });
    }
}