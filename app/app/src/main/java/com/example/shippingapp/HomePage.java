package com.example.shippingapp;

import static android.Manifest.permission.ACCESS_COARSE_LOCATION;
import static android.Manifest.permission.ACCESS_FINE_LOCATION;

import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.os.PersistableBundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.WorkerThread;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;

import com.example.shippingapp.common.Constant;
import com.example.shippingapp.common.LocationTrack;
import com.example.shippingapp.dto.AccountRespDTO;
import com.example.shippingapp.dto.CarrierRespDTO;
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


public class HomePage extends AppCompatActivity implements AdapterView.OnItemSelectedListener {

    private static final String LOG_TAG = HomePage.class.getSimpleName();
    public static AccountRespDTO user;
    private List<OrderRespDTO> orders;
    private LinearLayout containOrdersView;
    private Spinner orderStatusDropdown;


    private String currentStatus;

    public static String token;

    public boolean isDialogOpen = false;

    private StompClient mStompClient;

    public static Queue<SocketResponse<Integer>> queue;
    private TextView countNotificationsText;

    private List permissions = new ArrayList();
    private List<String> permissionsToRequest;
    private List<String> permissionsRejected = new ArrayList();

    public static UpdateLocationDTO updateLocationDTO;
    private final static int ALL_PERMISSIONS_RESULT = 101;

    private ProgressBar progressBar;

    LocationTrack locationTrack;

    SocketService socketService;

    private ImageButton checkSocket;



    private List<String> orderStatusCurrent = new ArrayList<>(Arrays.asList(Constant.OrderStatus.PICKING_UP_GOODS.name(),
            Constant.OrderStatus.REQUEST_SHIPPING.name(), Constant.OrderStatus.CANCEL.name()));

    @Override
    protected void onResume() {
        super.onResume();
        if (socketService.isCancelled()) {
            socketService.execute();
        }
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
        permissions.add(ACCESS_FINE_LOCATION);
        permissions.add(ACCESS_COARSE_LOCATION);

        permissionsToRequest = findUnAskedPermissions(permissions);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {


            if (permissionsToRequest.size() > 0)
                requestPermissions(permissionsToRequest.toArray(new String[permissionsToRequest.size()]), ALL_PERMISSIONS_RESULT);
        }


        Intent intent = getIntent();
        String message = intent.getStringExtra("user");
        token = "Bearer " + intent.getStringExtra("token");
        SharedPreferences sharedPreferences = getSharedPreferences("token", MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString("token", token).apply();
        containOrdersView = findViewById(R.id.orders_contains);
        user = new Gson().fromJson(message, AccountRespDTO.class);

        countNotificationsText = findViewById(R.id.count_notify);
        progressBar = findViewById(R.id.loading_home);
        progressBar.setVisibility(View.INVISIBLE);
        queue = new PriorityQueue<>();
        getCountNotification();
        socketService = new SocketService(getApplicationContext(), user);
        socketService.execute();
        checkSocket = findViewById(R.id.load_socket);
        checkSocket.setVisibility(View.VISIBLE);

        checkSocket.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (!socketService.getStompClient().isConnected()) {
                    socketService.getStompClient().reconnect();
                    if (socketService.getStompClient().isConnected()) {
                        toast("Kết nối lại thành công");
                    } else {
                        toast("Kết nối lại thất bại");
                    }
                    subcribeTopic();
                    return;
                }
                toast("Đã kết nối");
            }
        });

        socketService.getStompClient().lifecycle().subscribe(lifecycleEvent -> {
            switch (lifecycleEvent.getType()) {
                case OPENED:
                    subcribeTopic();
                    break;
                case ERROR:
                case CLOSED:
                    break;

            }
        });
        locationTrack = new LocationTrack(HomePage.this);
        if (locationTrack.getLocation() == null) {
            AuthService.authService.getCarrierProfile(token).enqueue(new Callback<ResponseTemplateDTO<CarrierRespDTO>>() {
                @Override
                public void onResponse(Call<ResponseTemplateDTO<CarrierRespDTO>> call, Response<ResponseTemplateDTO<CarrierRespDTO>> response) {
                    assert response.body() != null;
                    CarrierRespDTO carrierRespDTO = response.body().getData();
                    updateLocationDTO = new UpdateLocationDTO();
                    updateLocationDTO.setUserId(user.getId());
                    if (carrierRespDTO.getLatitudeNewest() != null && carrierRespDTO.getLongitudeNewest() != null) {
                        updateLocationDTO.setLatitude(carrierRespDTO.getLatitudeNewest());
                        updateLocationDTO.setLongitude(carrierRespDTO.getLongitudeNewest());
                    }
                }

                @Override
                public void onFailure(Call<ResponseTemplateDTO<CarrierRespDTO>> call, Throwable t) {

                }
            });
        }



//        showLocation();
        orderStatusDropdown = findViewById(R.id.order_status);
        orderStatusDropdown.setOnItemSelectedListener(this);
        updateDropdown();
    }

    public void buttonLoad(boolean display) {
        checkSocket.setVisibility(display ? View.VISIBLE : View.INVISIBLE);
    }
    @SuppressLint("CheckResult")
    public void subcribeTopic() {
        socketService.getStompClient().topic("/notify/order-cancel/" + user.getId()).subscribe(topicMess -> {
            Type type = new TypeToken<SocketResponse<Integer>>() {}.getType();
            SocketResponse<Integer> orderResp = new Gson().fromJson(topicMess.getPayload(), type);
            notificationDialog("order-cancel", "Hủy đơn", orderResp.getMessage());
//            notifications.add(NotificationRespDTO.builder().message(orderRequest.getMessage()).seen(false).build());
        }, throwable -> {
            Log.d("socket", throwable.getMessage());
        });
//
        socketService.getStompClient().topic("/request_shipping/" + user.getId()).subscribe(topicMess -> {
            Type type = new TypeToken<SocketResponse<Integer>>() {}.getType();
            SocketResponse<Integer> orderResp = new Gson().fromJson(topicMess.getPayload(), type);
            notificationDialog("request_shipping", "Yêu cầu vận chuyển", orderResp.getMessage());
            queue.add(orderResp);
            if (!isDialogOpen) {
                this.isDialogOpen = true;
                displayAlertDialog();
            }
        }, throwable -> {
            Log.d("socket", throwable.getMessage());
        });
    }

    private List findUnAskedPermissions(List<String> wanted) {
        List result = new ArrayList();
        for (String perm: wanted) {
            if (hasPermission(perm)) {
                result.add(perm);
            }
        }

        return result;
    }

    private boolean hasPermission(String permission) {
        if (canMakeSmores()) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                return (checkSelfPermission(permission) == PackageManager.PERMISSION_GRANTED);
            }
        }
        return true;
    }

    private boolean canMakeSmores() {
        return (Build.VERSION.SDK_INT > Build.VERSION_CODES.LOLLIPOP_MR1);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {

            case ALL_PERMISSIONS_RESULT:
                for (String perms : permissionsToRequest) {
                    if (!hasPermission(perms)) {
                        permissionsRejected.add(perms);
                    }
                }

                if (permissionsRejected.size() > 0) {


                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        if (shouldShowRequestPermissionRationale(permissionsRejected.get(0))) {
                            showMessageOKCancel("These permissions are mandatory for the application. Please allow access.",
                                    new DialogInterface.OnClickListener() {
                                        @Override
                                        public void onClick(DialogInterface dialog, int which) {
                                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                                                requestPermissions(permissionsRejected.toArray(new String[permissionsRejected.size()]), ALL_PERMISSIONS_RESULT);
                                            }
                                        }
                                    });
                            return;
                        }
                    }

                }

                break;
        }
    }

    private void showMessageOKCancel(String message, DialogInterface.OnClickListener okListener) {
        new AlertDialog.Builder(HomePage.this)
                .setMessage(message)
                .setPositiveButton("OK", okListener)
                .setNegativeButton("Cancel", null)
                .create()
                .show();
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

//    private void showLocation() {
//        LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
//        if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
//            if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
//                // TODO: Consider calling
//                //    ActivityCompat#requestPermissions
//                // here to request the missing permissions, and then overriding
//                //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
//                //                                          int[] grantResults)
//                // to handle the case where the user grants the permission. See the documentation
//                // for ActivityCompat#requestPermissions for more details.
//                return;
//            }
//            locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 10000, 10, this);
//        } else {
//            Toast.makeText(this, "Enable GPS", Toast.LENGTH_SHORT).show();
//        }
//    }

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
        progressBar.setVisibility(View.VISIBLE);
        AuthService.authService.getOrderByStatus(token, currentStatus).enqueue(new Callback<ResponseTemplateDTO<List<OrderRespDTO>>>() {
            @Override
            public void onResponse(Call<ResponseTemplateDTO<List<OrderRespDTO>>> call, Response<ResponseTemplateDTO<List<OrderRespDTO>>> response) {
                progressBar.setVisibility(View.INVISIBLE);
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
        if (orders.size() == 0) {
            final View empty = getLayoutInflater().inflate(R.layout.empty, null, false);
            TextView content = empty.findViewById(R.id.content_empty);
            content.setText("Không có đơn hàng nào");
            containOrdersView.addView(empty);
            return;
        }
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
            contactFrom.setText(item.getShop().getPhoneNumber());
            contactDes.setText(item.getCustomer().getPhoneNumber());
            containOrdersView.addView(componentItemOrder);
        });
    }

    public void onClickReceiveOrder(View view) {
        orderStatusCurrent = new ArrayList<>();
        orderStatusCurrent.addAll(Arrays.asList(
                Constant.OrderStatus.PICKING_UP_GOODS.name(),
                Constant.OrderStatus.REQUEST_SHIPPING.name(),
                Constant.OrderStatus.CANCEL.name()));
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
        Locale locale = new Locale("vi", "VN");
        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(locale);
        AuthService.authService.getOrderById(token, socketResponse.getData()).enqueue(new Callback<ResponseTemplateDTO<OrderRespDTO>>() {
            @Override
            public void onResponse(Call<ResponseTemplateDTO<OrderRespDTO>> call, Response<ResponseTemplateDTO<OrderRespDTO>> response) {
                Log.d("CALLAPI", "onResponse: " + response);
                assert response.body() != null;
                if (response.body() == null) {

                }
                OrderRespDTO order = response.body().getData();
                TextView fromAddress = dialog.findViewById(R.id.from_address_bottom);
                TextView destinationAddress = dialog.findViewById(R.id.destination_address_bottom);
                TextView shipFee = dialog.findViewById(R.id.ship_fee_dialog_bottom);
                fromAddress.setText(order.getFromAddress());
                destinationAddress.setText(order.getDestinationAddress());
                shipFee.setText(currencyFormat.format(order.getShipFee()));

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
                                    Log.d("RESP", "onResponse: " + resp);
                                    if (resp != null && resp.getCode().longValue() == Constant.Code.TAKE_A_ORDER_SUCCESSFUL.getCode()) {
                                        Toast.makeText(HomePage.this, "Nhận đơn hàng thành công", Toast.LENGTH_SHORT).show();
                                        getOrdersByStatus();
//                                        Intent intentToOrderDetail = new Intent(HomePage.this, OrderDetail.class);
//                                        intentToOrderDetail.putExtra("order_id", orderId);
//                                        startActivity(intentToOrderDetail);
                                    }
                                    if (response.code() == 400) {
                                        Toast.makeText(HomePage.this, "Đơn hàng đã được nhận trước đó", Toast.LENGTH_SHORT).show();
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

    private void notificationDialog(String channel, String title, String content) {
        NotificationManager notificationManager = (NotificationManager)       getSystemService(Context.NOTIFICATION_SERVICE);
        String NOTIFICATION_CHANNEL_ID = channel;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            @SuppressLint("WrongConstant") NotificationChannel notificationChannel = new NotificationChannel(NOTIFICATION_CHANNEL_ID, "My Notifications", NotificationManager.IMPORTANCE_MAX);
            // Configure the notification channel.
            notificationChannel.setDescription("Sample Channel description");
            notificationChannel.enableLights(true);
            notificationChannel.setLightColor(Color.RED);
            notificationChannel.setVibrationPattern(new long[]{0, 1000, 500, 1000});
            notificationChannel.enableVibration(true);
            notificationManager.createNotificationChannel(notificationChannel);
        }
        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this, NOTIFICATION_CHANNEL_ID);
        notificationBuilder.setAutoCancel(true)
                .setDefaults(Notification.DEFAULT_ALL)
                .setWhen(System.currentTimeMillis())
                .setSmallIcon(R.mipmap.ic_launcher)
                .setTicker("Tutorialspoint")
                //.setPriority(Notification.PRIORITY_MAX)
                .setContentTitle(title)
                .setContentText(content)
                .setContentInfo("Information");
        notificationManager.notify(1, notificationBuilder.build());
    }


}