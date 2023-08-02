package com.example.shippingapp;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.shippingapp.common.Constant;
import com.example.shippingapp.dto.OrderRespDTO;
import com.example.shippingapp.dto.ResponseTemplateDTO;
import com.example.shippingapp.services.AuthService;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class OrderDetail extends AppCompatActivity {

    private TextView addressFrom;
    private TextView nameDes;
    private TextView addressDes;

    private TextView deliveryCharge;
    private TextView shipFee;
    private TextView packageTotal;
    private TextView typeOrder;
    private TextView noteOrder;

    private OrderRespDTO order;
    Constant.OrderStatus statusNext;
    private String token;

    private static final List<Constant.OrderStatus> STATUS_LIST = new ArrayList<>(EnumSet.allOf(Constant.OrderStatus.class));


    private Button changeStatusButton;

    private Button backToHomeButton;

    private ImageButton directionFrom;
    private ImageButton directionDes;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_order_detail);
        token = HomePage.token;
        Intent intent = getIntent();
        long orderId = (long) intent.getSerializableExtra("order_id");

        getOrderById(orderId);

        addressFrom = findViewById(R.id.address_detail_order_from);
        nameDes = findViewById(R.id.name_des);
        addressDes = findViewById(R.id.address_des);
        deliveryCharge = findViewById(R.id.delivery_charge);
        shipFee = findViewById(R.id.ship_fee);
        packageTotal = findViewById(R.id.package_total);
        typeOrder = findViewById(R.id.type_order);
        noteOrder = findViewById(R.id.note_order);
        changeStatusButton = findViewById(R.id.change_status);
        directionFrom = findViewById(R.id.detail_address_from);
        directionDes = findViewById(R.id.detail_address_des);
    }

    private void setStatusForButton() {
        if (order.getStatus().equals(Constant.OrderStatus.REQUEST_SHIPPING.name()) && order.getCarrierId() == null) {
            changeStatusButton.setText("Nhận đơn");
            changeStatusButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    AuthService.authService.acceptOrder(token, order.getId()).enqueue(new Callback<ResponseTemplateDTO<Integer>>() {
                        @Override
                        public void onResponse(Call<ResponseTemplateDTO<Integer>> call, Response<ResponseTemplateDTO<Integer>> response) {
                            assert response.body() != null;
                            if (response.body().getCode().intValue() == 4009) {
                                Toast.makeText(OrderDetail.this, "Đơn hàng đã được nhận bởi người khác", Toast.LENGTH_SHORT).show();
                            } else {
                                Toast.makeText(OrderDetail.this, "Nhận đơn thành công", Toast.LENGTH_SHORT).show();
                            }
                            finish();
                        }

                        @Override
                        public void onFailure(Call<ResponseTemplateDTO<Integer>> call, Throwable t) {

                        }
                    });
                }
            });
        }
        else {
            String status = order.getStatus();
            Constant.OrderStatus statusCurrent = STATUS_LIST.stream().filter((item) -> item.name().equals(status)).findFirst().orElse(null);
            int statusNextIndex = STATUS_LIST.indexOf(statusCurrent) + 1;
            statusNext = STATUS_LIST.get(statusNextIndex);
            changeStatusButton.setText(statusCurrent.getStatus() + " >> " + statusNext.getStatus());
            changeStatusButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    AuthService.authService.changeStatus(token, order.getId(), statusNext).enqueue(new Callback<ResponseTemplateDTO<Integer>>() {
                        @Override
                        public void onResponse(Call<ResponseTemplateDTO<Integer>> call, Response<ResponseTemplateDTO<Integer>> response) {
                            Toast.makeText(OrderDetail.this, "Thay đổi trạng thái đơn thành công", Toast.LENGTH_SHORT).show();
                            order.setStatus(statusNext.name());
                            setStatusForButton();
                        }

                        @Override
                        public void onFailure(Call<ResponseTemplateDTO<Integer>> call, Throwable t) {
                            Toast.makeText(OrderDetail.this, "Thay đổi trạng thái đơn thất bại", Toast.LENGTH_SHORT).show();

                        }
                    });
                }
            });
        }
    }


    private void getOrderById(long id) {
        AuthService.authService.getOrderById(token, id).enqueue(new Callback<ResponseTemplateDTO<OrderRespDTO>>() {
            @Override
            public void onResponse(Call<ResponseTemplateDTO<OrderRespDTO>> call, Response<ResponseTemplateDTO<OrderRespDTO>> response) {
                order = response.body().getData();
                addressFrom.setText(order.getFromAddress());
                nameDes.setText(order.getCustomer().getName());
                addressDes.setText(order.getDestinationAddress());
                deliveryCharge.setText(String.valueOf(order.getPaymentTotal() - order.getShipFee()));
                shipFee.setText(order.getShipFee().toString());
                packageTotal.setText(order.getPaymentTotal().toString());
                typeOrder.setText(order.getType());
                noteOrder.setText(order.getNote());

                directionDes.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Intent intent = new Intent(OrderDetail.this, MapsActivity.class);
                        intent.putExtra("longitude", order.getDestinationLongitude());
                        intent.putExtra("latitude", order.getDestinationLat());
                        startActivity(intent);
                    }
                });

                directionFrom.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Intent intent = new Intent(OrderDetail.this, MapsActivity.class);
                        intent.putExtra("longitude", order.getShop().getLongitude());
                        intent.putExtra("latitude", order.getShop().getLatitude());
                        startActivity(intent);
                    }
                });
                setStatusForButton();
            }

            @Override
            public void onFailure(Call<ResponseTemplateDTO<OrderRespDTO>> call, Throwable t) {

            }
        });
    }

    public void handleBackToHome(View view) {
        finish();
    }
}