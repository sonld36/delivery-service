package com.example.shippingapp;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.shippingapp.common.Constant;
import com.example.shippingapp.dto.OrderRespDTO;
import com.example.shippingapp.dto.ResponseTemplateDTO;
import com.example.shippingapp.services.AuthService;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class OrderDetail extends AppCompatActivity {
    private TextView nameFrom;
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
    private ProgressBar progressBar;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_order_detail);
        token = HomePage.token;
        Intent intent = getIntent();
        long orderId = (long) intent.getSerializableExtra("order_id");
        progressBar = findViewById(R.id.loading_order_detail);
        progressBar.setVisibility(View.INVISIBLE);

        getOrderById(orderId);
        nameFrom = findViewById(R.id.name_from);
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
        if (order.getStatus().equals(Constant.OrderStatus.REFUNDS.name())) {
            changeStatusButton.setText("Đã hoàn");
            changeStatusButton.setEnabled(false);
        } else if (order.getStatus().equals(Constant.OrderStatus.DELIVERY_SUCCESSFUL.name())) {
            changeStatusButton.setText("Giao thành công");
            changeStatusButton.setEnabled(false);
        } else if (order.getStatus().equals(Constant.OrderStatus.DONE.name())) {
            changeStatusButton.setText("Đã hoàn tiền");
            changeStatusButton.setEnabled(false);
        } else if (order.getStatus().equals(Constant.OrderStatus.RETURN.name())) {
            changeStatusButton.setText("Đã hoàn đơn hủy giao");
            changeStatusButton.setEnabled(false);
        } else if (order.getStatus().equals(Constant.OrderStatus.REQUEST_SHIPPING.name()) && order.getCarrierId() == null) {
            changeStatusButton.setText("Nhận đơn");
            changeStatusButton.setOnClickListener(new View.OnClickListener() {
                ProgressBar loading = getProgressBar();
                @Override
                public void onClick(View v) {
                    loading.setVisibility(View.VISIBLE);
                    AuthService.authService.acceptOrder(token, order.getId()).enqueue(new Callback<ResponseTemplateDTO<Integer>>() {
                        @Override
                        public void onResponse(Call<ResponseTemplateDTO<Integer>> call, Response<ResponseTemplateDTO<Integer>> response) {
                            loading.setVisibility(View.INVISIBLE);
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
            CheckBox checkBox = findViewById(R.id.return_checkbox);
            if (statusNext == Constant.OrderStatus.DELIVERY_SUCCESSFUL) {
                checkBox.setVisibility(View.VISIBLE);
            }
            changeStatusButton.setText(statusCurrent.getStatus() + " >> " + statusNext.getStatus());
            checkBox.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
                @Override
                public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                    if (isChecked) statusNext = Constant.OrderStatus.REFUNDS;
                    else statusNext = Constant.OrderStatus.DELIVERY_SUCCESSFUL;
                    changeStatusButton.setText(statusCurrent.getStatus() + " >> " + statusNext.getStatus());
                }
            });

            changeStatusButton.setOnClickListener(new View.OnClickListener() {
                ProgressBar loading = getProgressBar();
                @Override
                public void onClick(View v) {
                    loading.setVisibility(View.VISIBLE);
                    AuthService.authService.changeStatus(token, order.getId(), statusNext).enqueue(new Callback<ResponseTemplateDTO<Integer>>() {
                        @Override
                        public void onResponse(Call<ResponseTemplateDTO<Integer>> call, Response<ResponseTemplateDTO<Integer>> response) {

                            loading.setVisibility(View.INVISIBLE);
                            Toast.makeText(OrderDetail.this, "Thay đổi trạng thái đơn thành công", Toast.LENGTH_SHORT).show();
                            order.setStatus(statusNext.name());
                            setStatusForButton();
                        }

                        @Override
                        public void onFailure(Call<ResponseTemplateDTO<Integer>> call, Throwable t) {
                            loading.setVisibility(View.INVISIBLE);
                            Toast.makeText(OrderDetail.this, "Thay đổi trạng thái đơn thất bại", Toast.LENGTH_SHORT).show();

                        }
                    });
                }
            });
        }
    }


    private void getOrderById(long id) {
        progressBar.setVisibility(View.VISIBLE);
        AuthService.authService.getOrderById(token, id).enqueue(new Callback<ResponseTemplateDTO<OrderRespDTO>>() {
            @Override
            public void onResponse(Call<ResponseTemplateDTO<OrderRespDTO>> call, Response<ResponseTemplateDTO<OrderRespDTO>> response) {
                progressBar.setVisibility(View.INVISIBLE);
                Locale locale = new Locale("vi", "VN");
                NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(locale);
                order = response.body().getData();
                nameFrom.setText(order.getShop().getName() != null ? order.getShop().getName() : order.getShop().getUsername());
                addressFrom.setText(order.getFromAddress());
                nameDes.setText(order.getCustomer().getName());
                addressDes.setText(order.getDestinationAddress());
                deliveryCharge.setText(currencyFormat.format(order.getPaymentTotal() - order.getShipFee()));
                shipFee.setText(currencyFormat.format(order.getShipFee()));
                packageTotal.setText(currencyFormat.format(order.getPaymentTotal()));
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


    public ProgressBar getProgressBar() {
        return progressBar;
    }
}