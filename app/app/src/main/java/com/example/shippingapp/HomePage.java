package com.example.shippingapp;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.PersistableBundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.LinearLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.WorkerThread;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.example.shippingapp.common.Constant;
import com.example.shippingapp.common.IBaseGPS;
import com.example.shippingapp.dto.AccountRespDTO;
import com.example.shippingapp.dto.OrderRespDTO;
import com.example.shippingapp.dto.ResponseTemplateDTO;
import com.example.shippingapp.dto.SocketResponse;
import com.example.shippingapp.dto.UpdateLocationDTO;
import com.example.shippingapp.services.AuthService;
import com.example.shippingapp.services.SocketService;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.PriorityQueue;
import java.util.Queue;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import ua.naiksoftware.stomp.StompClient;


public class HomePage extends AppCompatActivity implements AdapterView.OnItemSelectedListener, IBaseGPS {

    private static final String LOG_TAG = HomePage.class.getSimpleName();
    private AccountRespDTO user;
    private List<OrderRespDTO> orders;
    private LinearLayout containOrdersView;
    private Spinner orderStatusDropdown;


    private String currentStatus;

    public static String token;

    public boolean isDialogOpen = false;

    private StompClient mStompClient;

    public static Queue<SocketResponse<Integer>> queue;
    private TextView countNotificationsText;

    public static UpdateLocationDTO updateLocationDTO;



    private static final String ip = "ws://10.0.2.2:8080/api/socket/websocket";


    private List<String> orderStatusCurrent = new ArrayList<>(Arrays.asList(
            Constant.OrderStatus.REQUEST_SHIPPING.name(),
            Constant.OrderStatus.PICKING_UP_GOODS.name()));

    @Override
    protected void onResume() {
        super.onResume();
        getOrdersByStatus();
        this.isDialogOpen = true;
        displayAlertDialog();
        getCountNotification();
    }

    @Override
    public void onSaveInstanceState(@NonNull Bundle outState, @NonNull PersistableBundle outPersistentState) {
        if (user != null) {
            outState.putString("user", String.valueOf(user));
        }
        super.onSaveInstanceState(outState, outPersistentState);
    }

    @SuppressLint("CheckResult")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home_page);

        Intent intent = getIntent();
        String message = intent.getStringExtra("user");
        token = "Bearer " + intent.getStringExtra("token");
        SharedPreferences sharedPreferences = getSharedPreferences("token", MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString("token", token).apply();
        containOrdersView = findViewById(R.id.orders_contains);
        user = new Gson().fromJson(message, AccountRespDTO.class);
        countNotificationsText = findViewById(R.id.count_notify);
        queue = new PriorityQueue<>();
        getCountNotification();
        new SocketService(user).execute();

        SocketService.stompClient.topic("/notify/order-request/" + user.getId()).subscribe(topicMess -> {
            SocketResponse<OrderRespDTO> orderRequest = new Gson().fromJson(topicMess.getPayload(), SocketResponse.class);
            toast(orderRequest.getMessage());
//            notifications.add(NotificationRespDTO.builder().message(orderRequest.getMessage()).seen(false).build());
        }, throwable -> {
            Log.d("socket", throwable.getMessage());
        });
//
        SocketService.stompClient.topic("/request_shipping/" + user.getId()).subscribe(topicMess -> {
            Type type = new TypeToken<SocketResponse<Integer>>() {}.getType();
            SocketResponse<Integer> orderResp = new Gson().fromJson(topicMess.getPayload(), type);
            queue.add(orderResp);
            if (!isDialogOpen) {
                this.isDialogOpen = true;
                displayAlertDialog();
            }
        }, throwable -> {
            Log.d("socket", throwable.getMessage());
        });


        showLocation();
        orderStatusDropdown = findViewById(R.id.order_status);
        orderStatusDropdown.setOnItemSelectedListener(this);
        updateDropdown();
    }

    @Override
    protected void onPostResume() {
        super.onPostResume();
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        Log.d("test", "onRestart: ");
    }

    //    @Override
//    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
//        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
//        if (requestCode == 1000) {
//            if (grantResults[0] == PackageManager.PERMISSION_GRANTED &&
//                checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED
//            ) {
//                requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 1000);
//            }
//        }
//    }

    private void showLocation() {
        LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
            if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                // TODO: Consider calling
                //    ActivityCompat#requestPermissions
                // here to request the missing permissions, and then overriding
                //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                //                                          int[] grantResults)
                // to handle the case where the user grants the permission. See the documentation
                // for ActivityCompat#requestPermissions for more details.
                return;
            }
            locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 10000, 10, this);
        } else {
            Toast.makeText(this, "Enable GPS", Toast.LENGTH_SHORT).show();
        }
    }

    private void updateDropdown() {
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item, orderStatusCurrent);
        currentStatus = orderStatusCurrent.get(0);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        orderStatusDropdown.setAdapter(adapter);
        getOrdersByStatus();
    }

    private void getCountNotification() {
        AuthService.authService.getCountNotification(token).enqueue(new Callback<ResponseTemplateDTO<Integer>>() {
            @Override
            public void onResponse(Call<ResponseTemplateDTO<Integer>> call, Response<ResponseTemplateDTO<Integer>> response) {
                assert response.body() != null;
                int count = response.body().getData();
                countNotificationsText.setText(String.valueOf(count));
            }

            @Override
            public void onFailure(Call<ResponseTemplateDTO<Integer>> call, Throwable t) {

            }
        });
    }

    private void getOrdersByStatus() {
        AuthService.authService.getOrderByStatus(token, currentStatus).enqueue(new Callback<ResponseTemplateDTO<List<OrderRespDTO>>>() {
            @Override
            public void onResponse(Call<ResponseTemplateDTO<List<OrderRespDTO>>> call, Response<ResponseTemplateDTO<List<OrderRespDTO>>> response) {
                assert response.body() != null;

                orders = response.body().getData();
                addOrderView();
            }

            @Override
            public void onFailure(Call<ResponseTemplateDTO<List<OrderRespDTO>>> call, Throwable t) {

            }
        });
    }




    private void addOrderView() {
        containOrdersView.removeAllViews();
        Locale locale = new Locale("vi", "VN");
        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(locale);
        orders.forEach((item) -> {
            ViewGroup.MarginLayoutParams params = new ViewGroup.MarginLayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            params.setMargins(0,0,0, 20);
            final View componentItemOrder = getLayoutInflater().inflate(R.layout.component_item_order, null, false);
            componentItemOrder.setLayoutParams(params);
            TextView locationFrom = componentItemOrder.findViewById(R.id.location_from);
            TextView locationDes = componentItemOrder.findViewById(R.id.location_des);
            TextView shipFee = componentItemOrder.findViewById(R.id.order_fee);
            TextView orderId = componentItemOrder.findViewById(R.id.order_id);
            TextView contactFrom = componentItemOrder.findViewById(R.id.contact_from);
            TextView contactDes = componentItemOrder.findViewById(R.id.contact_des);
            componentItemOrder.findViewById(R.id.detail_order_button).setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(HomePage.this, OrderDetail.class);
                    intent.putExtra("order_id", item.getId());
                    startActivity(intent);
                }
            });
            locationFrom.setText(item.getFromAddress());
            locationDes.setText(item.getDestinationAddress());
            shipFee.setText(currencyFormat.format(item.getPaymentTotal()));
            orderId.setText(item.getId().toString());
            contactFrom.setText(item.getShop().getName());
            contactDes.setText(item.getCustomer().getPhoneNumber());
            containOrdersView.addView(componentItemOrder);
        });
    }

    public void onClickReceiveOrder(View view) {
        orderStatusCurrent = new ArrayList<>();
        orderStatusCurrent.addAll(Arrays.asList(
                Constant.OrderStatus.REQUEST_SHIPPING.name(),
                Constant.OrderStatus.PICKING_UP_GOODS.name()));
        currentStatus = orderStatusCurrent.get(0);
        getOrdersByStatus();
        updateDropdown();
    }

    public void onClickDeliveringOrder(View view) {
        orderStatusCurrent = new ArrayList<>();
        orderStatusCurrent.addAll(Arrays.asList(Constant.OrderStatus.BEING_TRANSPORTED.name(),
                Constant.OrderStatus.DELIVERY_SUCCESSFUL.name(),
                Constant.OrderStatus.REFUNDS.name()));
        currentStatus = orderStatusCurrent.get(0);
        getOrdersByStatus();
        updateDropdown();
    }

    @Override
    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
        Log.d(LOG_TAG, "onItemSelected: " + position);
        currentStatus = orderStatusCurrent.get(position);
        getOrdersByStatus();
    }

    @Override
    public void onNothingSelected(AdapterView<?> parent) {

    }

    public void handleClickNotiButton(View view) {
        Intent intent = new Intent(this, NotifyPage.class);
        startActivity(intent);
    }

    private void toast(String text) {
        Toast.makeText(this, text, Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onGpsStatusChanged(int event) {

    }

    @Override
    public void onLocationChanged(@NonNull Location location) {
        updateLocationDTO = UpdateLocationDTO.builder().userId(user.getId()).latitude(location.getLatitude()).longitude(location.getLongitude()).build();
        Gson gson = new Gson();
        String message = gson.toJson(updateLocationDTO);
        SocketService.stompClient.send("/app/location", message).subscribe();
    }

    public void handleClickProfileButton(View view) {
        Intent intent = new Intent(this, Profile.class);
        intent.putExtra("userId", user.getId());
        intent.putExtra("latestLocation", updateLocationDTO);
        startActivity(intent);
    }



    @WorkerThread
    public void displayAlertDialog() {
        if (queue.size() < 1) {
            this.isDialogOpen = false;
            return;
        };
        SocketResponse<Integer> socketResponse = queue.poll();
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        final View dialog = getLayoutInflater().inflate(R.layout.dialog_map, null, false);

        AuthService.authService.getOrderById(token, socketResponse.getData()).enqueue(new Callback<ResponseTemplateDTO<OrderRespDTO>>() {
            @Override
            public void onResponse(Call<ResponseTemplateDTO<OrderRespDTO>> call, Response<ResponseTemplateDTO<OrderRespDTO>> response) {
                OrderRespDTO order = response.body().getData();

                TextView fromAddress = dialog.findViewById(R.id.from_address_bottom);
                TextView destinationAddress = dialog.findViewById(R.id.destination_address_bottom);
                TextView shipFee = dialog.findViewById(R.id.ship_fee_dialog_bottom);
                fromAddress.setText(order.getFromAddress());
                destinationAddress.setText(order.getDestinationAddress());
                shipFee.setText(order.getShipFee().toString());

                ContextCompat.getMainExecutor(HomePage.this).execute(() -> {
                    builder.setTitle(socketResponse.getMessage());
                    builder.setView(dialog);
                    builder.setPositiveButton("Nhận đơn", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            AuthService.authService.acceptOrder(HomePage.token, socketResponse.getData()).enqueue(new Callback<ResponseTemplateDTO<Integer>>() {
                                @Override
                                public void onResponse(Call<ResponseTemplateDTO<Integer>> call, Response<ResponseTemplateDTO<Integer>> response) {
                                    Log.d("Accept", "onResponse: " + response);
                                    ResponseTemplateDTO<Integer> resp = response.body();
                                    if (resp.getCode().longValue() == Constant.Code.TAKE_A_ORDER_SUCCESSFUL.getCode()) {
                                        Toast.makeText(HomePage.this, "Nhận đơn hàng thành công", Toast.LENGTH_SHORT).show();
//                                        Intent intentToOrderDetail = new Intent(HomePage.this, OrderDetail.class);
//                                        intentToOrderDetail.putExtra("order_id", orderId);
//                                        startActivity(intentToOrderDetail);
                                    }
                                    if (resp.getCode().longValue() == Constant.Code.ORDER_WAS_ASSIGNED.getCode()) {
                                        Toast.makeText(HomePage.this, "Đơn hàng đã được vận chuyển", Toast.LENGTH_SHORT).show();
//                                        finish();
                                    }
                                }

                                @Override
                                public void onFailure(Call<ResponseTemplateDTO<Integer>> call, Throwable t) {

                                }
                            });
                            displayAlertDialog();
                        }
                    });

                    builder.setNeutralButton("Xem chi tiết", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            Intent intent = new Intent(HomePage.this, MapsActivity.class);
                            intent.putExtra("order", order);
                            intent.putExtra("longitude", order.getShop().getLongitude());
                            intent.putExtra("latitude", order.getShop().getLatitude());
                            startActivity(intent);
                        }
                    });

                    builder.setNegativeButton("Từ chối", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            AuthService.authService.rejectOrder(HomePage.token, socketResponse.getData()).enqueue(new Callback<ResponseTemplateDTO<Integer>>() {
                                @Override
                                public void onResponse(Call<ResponseTemplateDTO<Integer>> call, Response<ResponseTemplateDTO<Integer>> response) {
                                    if (response.body().getCode().longValue() == Constant.Code.UPDATE_ACCOUNT_SUCCESSFUL.getCode()) {
                                        Toast.makeText(HomePage.this, "Từ chối đơn hàng thành công", Toast.LENGTH_SHORT).show();
//                                        finish();
                                    }
                                }

                                @Override
                                public void onFailure(Call<ResponseTemplateDTO<Integer>> call, Throwable t) {

                                }
                            });
                            displayAlertDialog();
                        }
                    });

                    AlertDialog alertDialog = builder.create();
                    alertDialog.show();
                });
            }

            @Override
            public void onFailure(Call<ResponseTemplateDTO<OrderRespDTO>> call, Throwable t) {

            }
        });

//        SupportMapFragment supportMapFragment = (SupportMapFragment) getSupportFragmentManager().findFragmentById();


    }

}